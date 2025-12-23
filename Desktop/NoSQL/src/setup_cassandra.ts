
import { Client } from "cassandra-driver";

const client = new Client({
  contactPoints: ["127.0.0.1"],
  localDataCenter: "datacenter1",
});

async function setup() {
  try {
    await client.connect();
    console.log("Connected to Cassandra");

    // Create Keyspace
    await client.execute(`
      CREATE KEYSPACE IF NOT EXISTS university 
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1' }
    `);
    console.log("Keyspace 'university' ready");

    // Use Keyspace
    await client.execute("USE university");

    // Create course_activity table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS course_activity (
        student_id text,
        event_time timestamp,
        action_type text,
        module text,
        metadata text,
        PRIMARY KEY (student_id, event_time)
      ) WITH CLUSTERING ORDER BY (event_time DESC)
    `);
    console.log("Table 'course_activity' ready");

    // Create student_stats table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS student_stats (
        student_id text,
        metric_name text,
        total_count counter,
        PRIMARY KEY (student_id, metric_name)
      )
    `);
    console.log("Table 'student_stats' ready");

    process.exit(0);
  } catch (err) {
    console.error("Setup Error:", err);
    process.exit(1);
  }
}

setup();
