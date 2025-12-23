// services/neo4jService.ts
import driver from '../src/config/neo4j';
import { Session, Record } from 'neo4j-driver';

interface NodeProperties {
  id: string;
  name: string;
  [key: string]: any;
}

interface RelationshipProperties {
  [key: string]: any;
}

interface RelationshipResult {
  relType: string;
  relProps: RelationshipProperties;
  nodeLabels: string[];
  node: NodeProperties;
}

const getSession = (): Session => {
  if (!driver) {
    throw new Error('Neo4j driver is not initialized. Check connection and credentials.');
  }
  return driver.session();
};

// NODE CRUD: Student
export const createStudent = async (student: { id: string; name: string; major: string; year: number }): Promise<NodeProperties> => {
  const session = getSession();
  try {
    const result = await session.run(
      `CREATE (s:Student {
        id: $id,
        name: $name,
        major: $major,
        year: $year
      }) RETURN s`,
      student
    );
    return result.records[0].get('s').properties;
  } finally {
    await session.close();
  }
};

export const getAllStudents = async (): Promise<NodeProperties[]> => {
  const session = getSession();
  try {
    const result = await session.run('MATCH (s:Student) RETURN s');
    return result.records.map((r: Record) => r.get('s').properties);
  } finally {
    await session.close();
  }
};

export const getStudentById = async (id: string): Promise<NodeProperties | null> => {
  const session = getSession();
  try {
    const result = await session.run(
      'MATCH (s:Student {id: $id}) RETURN s',
      { id }
    );
    return result.records.length > 0 ? result.records[0].get('s').properties : null;
  } finally {
    await session.close();
  }
};

export const updateStudent = async (id: string, updates: Partial<NodeProperties>): Promise<NodeProperties | null> => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (s:Student {id: $id})
       SET s += $updates
       RETURN s`,
      { id, updates }
    );
    return result.records.length > 0 ? result.records[0].get('s').properties : null;
  } finally {
    await session.close();
  }
};

export const deleteStudent = async (id: string): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run(
      'MATCH (s:Student {id: $id}) DETACH DELETE s',
      { id }
    );
    return { message: 'Student deleted' };
  } finally {
    await session.close();
  }
};

// Similar for Instructor, Course, Department (omitted for brevity, but follow the same pattern)

export const createInstructor = async (instructor: { id: string; name: string; title: string }): Promise<NodeProperties> => {
  const session = getSession();
  try {
    const result = await session.run(
      `CREATE (i:Instructor { id: $id, name: $name, title: $title }) RETURN i`,
      instructor
    );
    return result.records[0].get('i').properties;
  } finally {
    await session.close();
  }
};

export const getAllInstructors = async (): Promise<NodeProperties[]> => {
  const session = getSession();
  try {
    const result = await session.run('MATCH (i:Instructor) RETURN i');
    return result.records.map((r: Record) => r.get('i').properties);
  } finally {
    await session.close();
  }
};

export const getInstructorById = async (id: string): Promise<NodeProperties | null> => {
  const session = getSession();
  try {
    const result = await session.run('MATCH (i:Instructor {id: $id}) RETURN i', { id });
    return result.records.length > 0 ? result.records[0].get('i').properties : null;
  } finally {
    await session.close();
  }
};

export const updateInstructor = async (id: string, updates: Partial<NodeProperties>): Promise<NodeProperties | null> => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (i:Instructor {id: $id}) SET i += $updates RETURN i`,
      { id, updates }
    );
    return result.records.length > 0 ? result.records[0].get('i').properties : null;
  } finally {
    await session.close();
  }
};

export const deleteInstructor = async (id: string): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run('MATCH (i:Instructor {id: $id}) DETACH DELETE i', { id });
    return { message: 'Instructor deleted' };
  } finally {
    await session.close();
  }
};

export const createCourse = async (course: { id: string; name: string; creditHours: number }): Promise<NodeProperties> => {
  const session = getSession();
  try {
    const result = await session.run(
      `CREATE (c:Course { id: $id, name: $name, creditHours: $creditHours }) RETURN c`,
      course
    );
    return result.records[0].get('c').properties;
  } finally {
    await session.close();
  }
};

export const getAllCourses = async (): Promise<NodeProperties[]> => {
  const session = getSession();
  try {
    const result = await session.run('MATCH (c:Course) RETURN c');
    return result.records.map((r: Record) => r.get('c').properties);
  } finally {
    await session.close();
  }
};

export const getCourseById = async (id: string): Promise<NodeProperties | null> => {
  const session = getSession();
  try {
    const result = await session.run('MATCH (c:Course {id: $id}) RETURN c', { id });
    return result.records.length > 0 ? result.records[0].get('c').properties : null;
  } finally {
    await session.close();
  }
};

export const updateCourse = async (id: string, updates: Partial<NodeProperties>): Promise<NodeProperties | null> => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (c:Course {id: $id}) SET c += $updates RETURN c`,
      { id, updates }
    );
    return result.records.length > 0 ? result.records[0].get('c').properties : null;
  } finally {
    await session.close();
  }
};

export const deleteCourse = async (id: string): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run('MATCH (c:Course {id: $id}) DETACH DELETE c', { id });
    return { message: 'Course deleted' };
  } finally {
    await session.close();
  }
};

export const createDepartment = async (dept: { id: string; name: string }): Promise<NodeProperties> => {
  const session = getSession();
  try {
    const result = await session.run(
      `CREATE (d:Department { id: $id, name: $name }) RETURN d`,
      dept
    );
    return result.records[0].get('d').properties;
  } finally {
    await session.close();
  }
};

export const getAllDepartments = async (): Promise<NodeProperties[]> => {
  const session = getSession();
  try {
    const result = await session.run('MATCH (d:Department) RETURN d');
    return result.records.map((r: Record) => r.get('d').properties);
  } finally {
    await session.close();
  }
};

export const getDepartmentById = async (id: string): Promise<NodeProperties | null> => {
  const session = getSession();
  try {
    const result = await session.run('MATCH (d:Department {id: $id}) RETURN d', { id });
    return result.records.length > 0 ? result.records[0].get('d').properties : null;
  } finally {
    await session.close();
  }
};

export const updateDepartment = async (id: string, updates: Partial<NodeProperties>): Promise<NodeProperties | null> => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (d:Department {id: $id}) SET d += $updates RETURN d`,
      { id, updates }
    );
    return result.records.length > 0 ? result.records[0].get('d').properties : null;
  } finally {
    await session.close();
  }
};

export const deleteDepartment = async (id: string): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run('MATCH (d:Department {id: $id}) DETACH DELETE d', { id });
    return { message: 'Department deleted' };
  } finally {
    await session.close();
  }
};

// RELATIONSHIPS CRUD

// (Student)-[:TAKES {semester, grade}]->(Course)
export const addTakesRelationship = async (studentId: string, courseId: string, props: { semester: string; grade: string }): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run(
      `MATCH (s:Student {id: $studentId}), (c:Course {id: $courseId})
       CREATE (s)-[:TAKES {semester: $semester, grade: $grade}]->(c)`,
      { studentId, courseId, ...props }
    );
    return { message: 'Takes relationship created' };
  } finally {
    await session.close();
  }
};

export const getTakesRelationships = async (studentId: string): Promise<{ course: NodeProperties; props: RelationshipProperties }[]> => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (s:Student {id: $studentId})-[r:TAKES]->(c:Course)
       RETURN c, properties(r) AS props`,
      { studentId }
    );
    return result.records.map((r: Record) => ({
      course: r.get('c').properties,
      props: r.get('props')
    }));
  } finally {
    await session.close();
  }
};

export const updateTakesRelationship = async (studentId: string, courseId: string, updates: Partial<{ semester: string; grade: string }>): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run(
      `MATCH (s:Student {id: $studentId})-[r:TAKES]->(c:Course {id: $courseId})
       SET r += $updates`,
      { studentId, courseId, updates }
    );
    return { message: 'Takes relationship updated' };
  } finally {
    await session.close();
  }
};

export const deleteTakesRelationship = async (studentId: string, courseId: string): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run(
      `MATCH (s:Student {id: $studentId})-[r:TAKES]->(c:Course {id: $courseId})
       DELETE r`,
      { studentId, courseId }
    );
    return { message: 'Takes relationship deleted' };
  } finally {
    await session.close();
  }
};

// (Instructor)-[:TEACHES {semester}]->(Course)
export const addTeachesRelationship = async (instructorId: string, courseId: string, props: { semester: string }): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run(
      `MATCH (i:Instructor {id: $instructorId}), (c:Course {id: $courseId})
       CREATE (i)-[:TEACHES {semester: $semester}]->(c)`,
      { instructorId, courseId, ...props }
    );
    return { message: 'Teaches relationship created' };
  } finally {
    await session.close();
  }
};

export const getTeachesRelationships = async (instructorId: string): Promise<{ course: NodeProperties; props: RelationshipProperties }[]> => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (i:Instructor {id: $instructorId})-[r:TEACHES]->(c:Course)
       RETURN c, properties(r) AS props`,
      { instructorId }
    );
    return result.records.map((r: Record) => ({
      course: r.get('c').properties,
      props: r.get('props')
    }));
  } finally {
    await session.close();
  }
};

export const updateTeachesRelationship = async (instructorId: string, courseId: string, updates: Partial<{ semester: string }>): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run(
      `MATCH (i:Instructor {id: $instructorId})-[r:TEACHES]->(c:Course {id: $courseId})
       SET r += $updates`,
      { instructorId, courseId, updates }
    );
    return { message: 'Teaches relationship updated' };
  } finally {
    await session.close();
  }
};

export const deleteTeachesRelationship = async (instructorId: string, courseId: string): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run(
      `MATCH (i:Instructor {id: $instructorId})-[r:TEACHES]->(c:Course {id: $courseId})
       DELETE r`,
      { instructorId, courseId }
    );
    return { message: 'Teaches relationship deleted' };
  } finally {
    await session.close();
  }
};

// (Course)-[:BELONGS_TO]->(Department) - no props
export const addBelongsToRelationship = async (courseId: string, departmentId: string): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run(
      `MATCH (c:Course {id: $courseId}), (d:Department {id: $departmentId})
       CREATE (c)-[:BELONGS_TO]->(d)`,
      { courseId, departmentId }
    );
    return { message: 'Belongs_to relationship created' };
  } finally {
    await session.close();
  }
};

export const getBelongsToRelationships = async (courseId: string): Promise<NodeProperties[]> => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (c:Course {id: $courseId})-[:BELONGS_TO]->(d:Department)
       RETURN d`,
      { courseId }
    );
    return result.records.map((r: Record) => r.get('d').properties);
  } finally {
    await session.close();
  }
};

// No update since no props

export const deleteBelongsToRelationship = async (courseId: string, departmentId: string): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run(
      `MATCH (c:Course {id: $courseId})-[r:BELONGS_TO]->(d:Department {id: $departmentId})
       DELETE r`,
      { courseId, departmentId }
    );
    return { message: 'Belongs_to relationship deleted' };
  } finally {
    await session.close();
  }
};

// (Instructor)-[:MEMBER_OF]->(Department) - no props
export const addMemberOfRelationship = async (instructorId: string, departmentId: string): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run(
      `MATCH (i:Instructor {id: $instructorId}), (d:Department {id: $departmentId})
       CREATE (i)-[:MEMBER_OF]->(d)`,
      { instructorId, departmentId }
    );
    return { message: 'Member_of relationship created' };
  } finally {
    await session.close();
  }
};

export const getMemberOfRelationships = async (instructorId: string): Promise<NodeProperties[]> => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (i:Instructor {id: $instructorId})-[:MEMBER_OF]->(d:Department)
       RETURN d`,
      { instructorId }
    );
    return result.records.map((r: Record) => r.get('d').properties);
  } finally {
    await session.close();
  }
};

// No update

export const deleteMemberOfRelationship = async (instructorId: string, departmentId: string): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run(
      `MATCH (i:Instructor {id: $instructorId})-[r:MEMBER_OF]->(d:Department {id: $departmentId})
       DELETE r`,
      { instructorId, departmentId }
    );
    return { message: 'Member_of relationship deleted' };
  } finally {
    await session.close();
  }
};

// (Course)-[:PREREQUISITE_OF]->(Course) - no props, note direction: prereq -> dependent
export const addPrerequisiteOfRelationship = async (prereqCourseId: string, dependentCourseId: string): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run(
      `MATCH (p:Course {id: $prereqCourseId}), (d:Course {id: $dependentCourseId})
       CREATE (p)-[:PREREQUISITE_OF]->(d)`,
      { prereqCourseId, dependentCourseId }
    );
    return { message: 'Prerequisite_of relationship created' };
  } finally {
    await session.close();
  }
};

export const getPrerequisiteOfRelationships = async (prereqCourseId: string): Promise<NodeProperties[]> => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (p:Course {id: $prereqCourseId})-[:PREREQUISITE_OF]->(d:Course)
       RETURN d`,
      { prereqCourseId }
    );
    return result.records.map((r: Record) => r.get('d').properties);
  } finally {
    await session.close();
  }
};

// No update

export const deletePrerequisiteOfRelationship = async (prereqCourseId: string, dependentCourseId: string): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run(
      `MATCH (p:Course {id: $prereqCourseId})-[r:PREREQUISITE_OF]->(d:Course {id: $dependentCourseId})
       DELETE r`,
      { prereqCourseId, dependentCourseId }
    );
    return { message: 'Prerequisite_of relationship deleted' };
  } finally {
    await session.close();
  }
};

// (Student)-[:ADVISED_BY]->(Instructor) - no props
export const addAdvisedByRelationship = async (studentId: string, instructorId: string): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run(
      `MATCH (s:Student {id: $studentId}), (i:Instructor {id: $instructorId})
       CREATE (s)-[:ADVISED_BY]->(i)`,
      { studentId, instructorId }
    );
    return { message: 'Advised_by relationship created' };
  } finally {
    await session.close();
  }
};

export const getAdvisedByRelationships = async (studentId: string): Promise<NodeProperties[]> => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (s:Student {id: $studentId})-[:ADVISED_BY]->(i:Instructor)
       RETURN i`,
      { studentId }
    );
    return result.records.map((r: Record) => r.get('i').properties);
  } finally {
    await session.close();
  }
};

// No update

export const deleteAdvisedByRelationship = async (studentId: string, instructorId: string): Promise<{ message: string }> => {
  const session = getSession();
  try {
    await session.run(
      `MATCH (s:Student {id: $studentId})-[r:ADVISED_BY]->(i:Instructor {id: $instructorId})
       DELETE r`,
      { studentId, instructorId }
    );
    return { message: 'Advised_by relationship deleted' };
  } finally {
    await session.close();
  }
};

// COMPLEX QUERY
export const getStudentsAdvisedByInstructorsOfCourseWithPrereqs = async (courseId: string): Promise<{ student: any; prerequisites: { id: string; name: string }[] }[]> => {
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (c:Course {id: $courseId})<-[:TEACHES]-(i:Instructor)<-[:ADVISED_BY]-(s:Student)
      OPTIONAL MATCH (c)<-[:PREREQUISITE_OF*1..2]-(prereq:Course)
      WITH s, collect(DISTINCT i.name) AS advisedByNames, collect(DISTINCT prereq { .id, .name }) AS prerequisites
      RETURN 
        s { .*, advisedBy: advisedByNames } AS student,
        prerequisites
      `,
      { courseId }
    );

    return result.records.map((record: Record) => ({
      student: record.get('student'),
      prerequisites: record.get('prerequisites')
    }));
  } finally {
    await session.close();
  }
};