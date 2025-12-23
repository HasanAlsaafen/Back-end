import mongoose from "mongoose";
import { Student } from "../models/Student";
import { StudentService } from "./services/StudentService";

const studentService = new StudentService();

const seedData = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://221141_db_user:Itmh0soC52v6tCHA@cluster0.smouza3.mongodb.net/university_db?appName=Cluster0"
    );
    console.log("Connected to MongoDB for Seeding...");

    await Student.deleteMany({});

    const students = [
      {
        studentId: "2023001",
        name: "Sami Abu-Zaid",
        email: "sami@edu.ps",
        program: {
          programId: "CS",
          programName: "Computer Science",
          department: "IT",
        },
        enrollments: [
          {
            courseId: "CS101",
            courseName: "NoSQL DBs",
            instructorName: "Dr. Omar",
            semester: "Fall 2024",
            grade: 95,
          },
          {
            courseId: "CS102",
            courseName: "Web Development",
            instructorName: "Eng. Sarah",
            semester: "Fall 2024",
            grade: 88,
          },
        ],
      },
      {
        studentId: "2023002",
        name: "Laila Hassan",
        email: "laila@edu.ps",
        program: {
          programId: "CS",
          programName: "Computer Science",
          department: "IT",
        },
        enrollments: [
          {
            courseId: "CS101",
            courseName: "NoSQL DBs",
            instructorName: "Dr. Omar",
            semester: "Fall 2024",
            grade: 70,
          },
          {
            courseId: "CS103",
            courseName: "Algorithms",
            instructorName: "Dr. Rami",
            semester: "Fall 2024",
            grade: 85,
          },
        ],
      },
      {
        studentId: "2023003",
        name: "Omar Ali",
        email: "omar@edu.ps",
        program: {
          programId: "SE",
          programName: "Software Engineering",
          department: "IT",
        },
        enrollments: [
          {
            courseId: "SE201",
            courseName: "Software Architecture",
            instructorName: "Dr. Zaid",
            semester: "Fall 2024",
            grade: 92,
          },
        ],
      },
      {
        studentId: "2023004",
        name: "Noor Salem",
        email: "noor@edu.ps",
        program: {
          programId: "EE",
          programName: "Electrical Engineering",
          department: "Engineering",
        },
        enrollments: [
          {
            courseId: "EE101",
            courseName: "Circuits I",
            instructorName: "Dr. Khalid",
            semester: "Fall 2024",
            grade: 65,
          },
          {
            courseId: "EE102",
            courseName: "Digital Logic",
            instructorName: "Dr. Muna",
            semester: "Fall 2024",
            grade: 75,
          },
        ],
      },
      {
        studentId: "2023005",
        name: "Majd Izzat",
        email: "majd@edu.ps",
        program: {
          programId: "ME",
          programName: "Mechanical Engineering",
          department: "Engineering",
        },
        enrollments: [
          {
            courseId: "ME301",
            courseName: "Thermodynamics",
            instructorName: "Dr. Amjad",
            semester: "Fall 2024",
            grade: 82,
          },
        ],
      },
    ];

    await Student.insertMany(students);

    const report = await studentService.getDepartmentStats();
    console.table(report);
  } catch (err) {
    console.error(" Seeding Error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("\nConnection closed.");
  }
};

seedData();
