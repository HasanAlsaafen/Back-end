import { Request, Response } from 'express';
import { StudentService } from '../services/StudentService';
import { addTakesRelationship, findRecommendedPeers, findSuggestedMentors } from '../services/neo4jService';
import { InfluxService } from '../services/InfluxService';
import { redisService } from '../services/RedisService';

const studentService = new StudentService();
const influxService = new InfluxService();

export class StudentController {
  
  async getAll(req: Request, res: Response) {
    const cacheKey = 'mongo:students:all';
    try {
      const cached = await redisService.get(cacheKey);
      if (cached) {
          res.setHeader('X-Cache', 'HIT');
          return res.json(cached);
      }

      const students = await studentService.getAllStudents();
      await redisService.set(cacheKey, students, 3600);
      
      res.setHeader('X-Cache', 'MISS');
      res.json(students);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    const studentId = req.params.id;
    const cacheKey = `student:${studentId}`;
    try {
      // 1. Check Redis
      const cached = await redisService.get(cacheKey);
      if (cached) {
          res.setHeader('X-Cache', 'HIT');
          return res.json(cached);
      }

      // 2. Fetch from Mongo
      const student = await studentService.getStudentById(studentId);
      if (!student) return res.status(404).json({ error: 'Student not found' });

      // 3. Save to Redis (1 Hour TTL)
      await redisService.set(cacheKey, student, 3600);
      
      res.setHeader('X-Cache', 'MISS');
      res.json(student);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const student = await studentService.createStudent(req.body);
      await redisService.del('mongo:students:all');
      res.status(201).json(student);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
      try {
          await studentService.deleteStudent(req.params.id);
          await redisService.del('mongo:students:all');
          res.json({ message: 'Deleted' });
      } catch (error: any) {
          res.status(500).json({ error: error.message });
      }
  }

  async addEnrollment(req: Request, res: Response) {
    try {
      const { courseId, courseName, semester, grade } = req.body;
      const studentId = req.params.id;
      
      const result = await studentService.addEnrollment(studentId, { courseId, courseName, semester, grade });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStats(req: Request, res: Response) {
      try {
          const stats = await studentService.getDepartmentStats();
          res.json(stats);
      } catch (error: any) {
          res.status(500).json({ error: error.message });
      }
  }
  
  // NEW: Atomic-like Enrollment (Unified Endpoint)
  async unifiedEnroll(req: Request, res: Response) {
      // Body: { studentId, courseId, semester, grade, courseName (optional) }
      const { studentId, courseId, semester, grade, courseName } = req.body;
      
      try {
          console.log(`[Enrollment] Starting unified enrollment for ${studentId} -> ${courseId}`);

          // 1. Neo4j: Create Relationship
          // If this fails, we stop.
          await addTakesRelationship(studentId, courseId, { semester, grade });
          console.log('[Enrollment] Step 1: Neo4j relation created');
          
          // 2. MongoDB: Update Student Document
          // Using a default name if not provided (frontend usually should provide it)
          const cName = courseName || `Course ${courseId}`;
          await studentService.addEnrollment(studentId, { courseId, courseName: cName, semester, grade });
          console.log('[Enrollment] Step 2: Mongo enrollment added');
          
          // 3. InfluxDB: Log Event
          // Fire and forget (don't fail the request if logging fails, but log error)
          influxService.logEnrollmentEvent(studentId, courseId).catch(err => console.error("Influx log failed", err));
          
          // 4. Redis: Invalidate Caches
          await redisService.del(`student:${studentId}`);
          await redisService.delByPattern('analytics:*');

          res.status(201).json({ message: 'Enrollment successful across all databases and cache invalidated' });
      } catch (error: any) {
          console.error('[Enrollment] Failed:', error);
          // In a real app, we would attempt rollback here (e.g. delete Neo4j relation)
          res.status(500).json({ error: error.message });
      }
  }

  // NEW: Get Peers
  async getRecommendedPeers(req: Request, res: Response) {
      try {
          const peers = await findRecommendedPeers(req.params.studentId);
          res.json(peers);
      } catch (error: any) {
          res.status(500).json({ error: error.message });
      }
  }
  
  // NEW: Get Course Enrollment Stats (Aggregation)
  async getEnrollmentStats(req: Request, res: Response) {
      try {
          const stats = await studentService.getCourseEnrollmentStats();
          res.json(stats);
      } catch (error: any) {
          res.status(500).json({ error: error.message });
      }
  }

  // COMPLEX QUERY: Get Avg GPA Per Program
  async getAvgGpaStats(req: Request, res: Response) {
      try {
          const stats = await studentService.getProgramGPAStats();
          res.json(stats);
      } catch (error: any) {
          res.status(500).json({ error: error.message });
      }
  }

  // COMPLEX QUERY: Get Suggested Mentors (Neo4j)
  async getSuggestedMentors(req: Request, res: Response) {
      try {
          const mentors = await findSuggestedMentors(req.params.studentId);
          res.json(mentors);
      } catch (error: any) {
          res.status(500).json({ error: error.message });
      }
  }
}