import { Point } from '@influxdata/influxdb-client';
import { writeApi, queryApi } from '../config/influx';

export class InfluxService {
  
  async writeMetric(metric: { 
      student_id: string; 
      action: string; 
      value?: number; // For scores
      status?: string; // For attendance (Present/Absent)
  }) {
    // Tag 'activity_type' = action
    const point = new Point('course_activity')
      .tag('student_id', metric.student_id)
      .tag('activity_type', metric.action);
    
    if (metric.value !== undefined) {
        point.floatField('score', metric.value);
    }
    
    // If status exists (e.g. Present), generic value 1 for 'Present', 0 for 'Absent' 
    // OR we can use a stringField if we just want to log the text. 
    // User asked for "Score is float... but for Attendance use Status field".
    // InfluxDB supports mixed fields.
    if (metric.status) {
        point.stringField('status', metric.status);
    }
    
    writeApi.writePoint(point);
    await writeApi.flush(); 
    return { message: 'Activity logged to Influx' };
  }

  async logEnrollmentEvent(studentId: string, courseId: string) {
      const point = new Point('enrollment_events')
          .tag('student_id', studentId)
          .tag('course_id', courseId)
          .stringField('message', 'Student Enrolled successfully');
      
      writeApi.writePoint(point);
      await writeApi.flush();
  }

  async getMetrics(studentId: string) {
    const fluxQuery = `
      from(bucket: "${process.env.INFLUX_BUCKET || 'StudentActivities'}")
      |> range(start: -30d)
      |> filter(fn: (r) => r._measurement == "course_activity")
      |> filter(fn: (r) => r.student_id == "${studentId}")
    `;
    
    const rows: any[] = [];
    return new Promise((resolve, reject) => {
        queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                rows.push(o);
            },
            error(error) {
                console.error("Influx Query Error:", error);
                resolve([]); 
            },
            complete() {
                resolve(rows);
            },
        });
    });
  }

  // COMPLEX QUERY: Peak Activity Hours (Last 30 days)
  async getPeakActivityHours() {
    const fluxQuery = `
      from(bucket: "${process.env.INFLUX_BUCKET || 'StudentActivities'}")
      |> range(start: -30d)
      |> filter(fn: (r) => r._measurement == "course_activity")
      |> hourSelection(start: 0, stop: 23)
      |> group(columns: ["_time"])
      |> count()
      // Note: Full time grouping/windowing for peaks is better done with aggregateWindow or specific flux logic
      // For POC, we'll return a raw but windowed count per hour.
    `;
    // For simplicity in POC, let's return a list of counts per hour of day.
    // Real implementation would use aggregateWindow(every: 1h, fn: count).
    const fluxPeak = `
      from(bucket: "${process.env.INFLUX_BUCKET || 'StudentActivities'}")
      |> range(start: -30d)
      |> filter(fn: (r) => r._measurement == "course_activity")
      |> aggregateWindow(every: 1h, fn: count, createEmpty: false)
      |> group()
      |> sort(columns: ["_value"], desc: true)
      |> limit(n: 5)
    `;

    const rows: any[] = [];
    return new Promise((resolve, reject) => {
        queryApi.queryRows(fluxPeak, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                rows.push({
                    hour: new Date(o._time).getHours(),
                    count: o._value,
                    time: o._time
                });
            },
            error(error) { resolve([]); },
            complete() { resolve(rows); },
        });
    });
  }
}
