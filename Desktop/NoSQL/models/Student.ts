// models/Student.ts
import { Schema, model, Document } from "mongoose";

export interface IEnrollment {
  courseId: string;
  courseName: string;
  instructorName: string; 
  semester: string;
  grade?: number;
}

interface IStudent extends Document {
  studentId: string;
  name: string;
  email: string;
  program: {
    programId: string;
    programName: string;
    department: string;
  };
  enrollments: IEnrollment[];
}

const studentSchema = new Schema<IStudent>({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  program: {
    programId: String,
    programName: String,
    department: String,
  },
  enrollments: [
    {
      courseId: String,
      courseName: String,
      instructorName: String, 
      semester: String,
      grade: { type: Number, default: 0 },
    },
  ],
});

export const Student = model<IStudent>("Student", studentSchema);