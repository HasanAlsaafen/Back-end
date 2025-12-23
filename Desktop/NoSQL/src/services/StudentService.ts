import { Student } from "../../models/Student";

export class StudentService {
  
  async getAllStudents() {
    return await Student.find({}, { _id: 0, __v: 0 }); // Exclude generic mongo ID and version
  }

  async getStudentById(studentId: string) {
    return await Student.findOne({ studentId }, { _id: 0, __v: 0 });
  }

  async createStudent(data: {
    studentId: string;
    name: string;
    email: string;
    program?: {
      programId: string;
      programName: string;
      department: string;
    };
  }) {
    const student = new Student(data);
    await student.save();
    return student;
  }
  
  async deleteStudent(studentId: string) {
      return await Student.deleteOne({ studentId });
  }

  async addEnrollment(studentId: string, enrollment: {
      courseId: string;
      courseName: string;
      semester: string;
      grade: string;
  }) {
      return await Student.updateOne(
          { studentId },
          { $push: { enrollments: enrollment } }
      );
  }

  async getDepartmentStats() {
      // Basic Aggregation: Count students per program
      return await Student.aggregate([
          { $group: { _id: "$program.department", count: { $sum: 1 } } }
      ]);
  }
  
  // NEW: Simple aggregation for Average Grade (Simulated as we store grades as strings usually, but assuming we can convert or count)
  // Since grades are strings ('A', 'B'), computing average numeric GPA via Mongo aggregation is complex.
  // Instead, let's aggregate 'Enrollment Count per Course'.
  async getCourseEnrollmentStats() {
      return await Student.aggregate([
          { $unwind: "$enrollments" },
          { $group: { _id: "$enrollments.courseName", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
      ]);
  }

  // COMPLEX QUERY: Average GPA per Program
  async getProgramGPAStats() {
      return await Student.aggregate([
          { $unwind: "$enrollments" },
          // Convert letter grades to numeric values if necessary, or assume grade is a number 
          // For the POC, we'll assume 'grade' field is a number (float).
          { $group: { 
              _id: "$program.programName", 
              avgGpa: { $avg: "$enrollments.grade" },
              studentCount: { $addToSet: "$studentId" }
          }},
          { $project: {
              programName: "$_id",
              avgGpa: { $round: ["$avgGpa", 2] },
              studentCount: { $size: "$studentCount" }
          }}
      ]);
  }
}
