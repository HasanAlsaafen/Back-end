// controllers/academicNetworkController.ts
import { Request, Response } from 'express';
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  createInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  addTakesRelationship,
  getTakesRelationships,
  updateTakesRelationship,
  deleteTakesRelationship,
  addTeachesRelationship,
  getTeachesRelationships,
  updateTeachesRelationship,
  deleteTeachesRelationship,
  addBelongsToRelationship,
  getBelongsToRelationships,
  deleteBelongsToRelationship,
  addMemberOfRelationship,
  getMemberOfRelationships,
  deleteMemberOfRelationship,
  addPrerequisiteOfRelationship,
  getPrerequisiteOfRelationships,
  deletePrerequisiteOfRelationship,
  addAdvisedByRelationship,
  getAdvisedByRelationships,
  deleteAdvisedByRelationship,
  getStudentsAdvisedByInstructorsOfCourseWithPrereqs,
  getDepartmentInfluence
} from '../services/neo4jService';

// Student CRUD
export const createStudentCtrl = async (req: Request, res: Response) => {
  try {
    const student = await createStudent(req.body);
    res.status(201).json(student);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllStudentsCtrl = async (req: Request, res: Response) => {
  try {
    const students = await getAllStudents();
    res.json(students);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentByIdCtrl = async (req: Request, res: Response) => {
  try {
    const student = await getStudentById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStudentCtrl = async (req: Request, res: Response) => {
  try {
    const student = await updateStudent(req.params.id, req.body);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteStudentCtrl = async (req: Request, res: Response) => {
  try {
    const result = await deleteStudent(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Similar controllers for Instructor, Course, Department (follow pattern)

export const createInstructorCtrl = async (req: Request, res: Response) => {
  try {
    const instructor = await createInstructor(req.body);
    res.status(201).json(instructor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllInstructorsCtrl = async (req: Request, res: Response) => {
  try {
    const instructors = await getAllInstructors();
    res.json(instructors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getInstructorByIdCtrl = async (req: Request, res: Response) => {
  try {
    const instructor = await getInstructorById(req.params.id);
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
    res.json(instructor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInstructorCtrl = async (req: Request, res: Response) => {
  try {
    const instructor = await updateInstructor(req.params.id, req.body);
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });
    res.json(instructor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteInstructorCtrl = async (req: Request, res: Response) => {
  try {
    const result = await deleteInstructor(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCourseCtrl = async (req: Request, res: Response) => {
  try {
    const course = await createCourse(req.body);
    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCoursesCtrl = async (req: Request, res: Response) => {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCourseByIdCtrl = async (req: Request, res: Response) => {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCourseCtrl = async (req: Request, res: Response) => {
  try {
    const course = await updateCourse(req.params.id, req.body);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCourseCtrl = async (req: Request, res: Response) => {
  try {
    const result = await deleteCourse(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createDepartmentCtrl = async (req: Request, res: Response) => {
  try {
    const dept = await createDepartment(req.body);
    res.status(201).json(dept);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllDepartmentsCtrl = async (req: Request, res: Response) => {
  try {
    const depts = await getAllDepartments();
    res.json(depts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDepartmentByIdCtrl = async (req: Request, res: Response) => {
  try {
    const dept = await getDepartmentById(req.params.id);
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    res.json(dept);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDepartmentCtrl = async (req: Request, res: Response) => {
  try {
    const dept = await updateDepartment(req.params.id, req.body);
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    res.json(dept);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDepartmentCtrl = async (req: Request, res: Response) => {
  try {
    const result = await deleteDepartment(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Relationships CRUD Controllers

// TAKES
export const addTakesCtrl = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId, semester, grade } = req.body;
    const result = await addTakesRelationship(studentId, courseId, { semester, grade });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTakesCtrl = async (req: Request, res: Response) => {
  try {
    const relationships = await getTakesRelationships(req.params.studentId);
    res.json(relationships);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTakesCtrl = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId } = req.params;
    const updates = req.body;
    const result = await updateTakesRelationship(studentId, courseId, updates);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTakesCtrl = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId } = req.params;
    const result = await deleteTakesRelationship(studentId, courseId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// TEACHES
export const addTeachesCtrl = async (req: Request, res: Response) => {
  try {
    const { instructorId, courseId, semester } = req.body;
    const result = await addTeachesRelationship(instructorId, courseId, { semester });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTeachesCtrl = async (req: Request, res: Response) => {
  try {
    const relationships = await getTeachesRelationships(req.params.instructorId);
    res.json(relationships);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTeachesCtrl = async (req: Request, res: Response) => {
  try {
    const { instructorId, courseId } = req.params;
    const updates = req.body;
    const result = await updateTeachesRelationship(instructorId, courseId, updates);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTeachesCtrl = async (req: Request, res: Response) => {
  try {
    const { instructorId, courseId } = req.params;
    const result = await deleteTeachesRelationship(instructorId, courseId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// BELONGS_TO
export const addBelongsToCtrl = async (req: Request, res: Response) => {
  try {
    const { courseId, departmentId } = req.body;
    const result = await addBelongsToRelationship(courseId, departmentId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBelongsToCtrl = async (req: Request, res: Response) => {
  try {
    const relationships = await getBelongsToRelationships(req.params.courseId);
    res.json(relationships);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBelongsToCtrl = async (req: Request, res: Response) => {
  try {
    const { courseId, departmentId } = req.params;
    const result = await deleteBelongsToRelationship(courseId, departmentId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// MEMBER_OF
export const addMemberOfCtrl = async (req: Request, res: Response) => {
  try {
    const { instructorId, departmentId } = req.body;
    const result = await addMemberOfRelationship(instructorId, departmentId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMemberOfCtrl = async (req: Request, res: Response) => {
  try {
    const relationships = await getMemberOfRelationships(req.params.instructorId);
    res.json(relationships);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMemberOfCtrl = async (req: Request, res: Response) => {
  try {
    const { instructorId, departmentId } = req.params;
    const result = await deleteMemberOfRelationship(instructorId, departmentId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// PREREQUISITE_OF
export const addPrerequisiteOfCtrl = async (req: Request, res: Response) => {
  try {
    const { prereqCourseId, dependentCourseId } = req.body;
    const result = await addPrerequisiteOfRelationship(prereqCourseId, dependentCourseId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPrerequisiteOfCtrl = async (req: Request, res: Response) => {
  try {
    const relationships = await getPrerequisiteOfRelationships(req.params.prereqCourseId);
    res.json(relationships);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePrerequisiteOfCtrl = async (req: Request, res: Response) => {
  try {
    const { prereqCourseId, dependentCourseId } = req.params;
    const result = await deletePrerequisiteOfRelationship(prereqCourseId, dependentCourseId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ADVISED_BY
export const addAdvisedByCtrl = async (req: Request, res: Response) => {
  try {
    const { studentId, instructorId } = req.body;
    const result = await addAdvisedByRelationship(studentId, instructorId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdvisedByCtrl = async (req: Request, res: Response) => {
  try {
    const relationships = await getAdvisedByRelationships(req.params.studentId);
    res.json(relationships);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAdvisedByCtrl = async (req: Request, res: Response) => {
  try {
    const { studentId, instructorId } = req.params;
    const result = await deleteAdvisedByRelationship(studentId, instructorId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Complex Query
export const getAdvisedStudentsWithPrereqsCtrl = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const results = await getStudentsAdvisedByInstructorsOfCourseWithPrereqs(courseId);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No advised students found for this course' });
    }
    res.json({
      courseId,
      advisedStudentsWithPrereqs: results
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDepartmentInfluenceCtrl = async (req: Request, res: Response) => {
  try {
    const stats = await getDepartmentInfluence();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};