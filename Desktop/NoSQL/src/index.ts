import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import neo4j, { Driver } from 'neo4j-driver';
import cors from 'cors'; // Added for frontend integration
import { connectDB } from './config/database';
import { connectCassandra, cassandraService } from './config/cassandra';
import { checkInfluxConnection } from './config/influx';
import { connectRedis } from './config/redis';
import { StudentController } from './controllers/StudentController';
import { CassandraController } from './controllers/CassandraController';
import { InfluxController } from './controllers/InfluxController';
import { redisService } from './services/RedisService';

// Import Controllers
import {
  createStudentCtrl, getAllStudentsCtrl, getStudentByIdCtrl, updateStudentCtrl, deleteStudentCtrl,
  createInstructorCtrl, getAllInstructorsCtrl, getInstructorByIdCtrl, updateInstructorCtrl, deleteInstructorCtrl,
  createCourseCtrl, getAllCoursesCtrl, getCourseByIdCtrl, updateCourseCtrl, deleteCourseCtrl,
  createDepartmentCtrl, getAllDepartmentsCtrl, getDepartmentByIdCtrl, updateDepartmentCtrl, deleteDepartmentCtrl,
  addTakesCtrl, getTakesCtrl, updateTakesCtrl, deleteTakesCtrl,
  addTeachesCtrl, getTeachesCtrl, updateTeachesCtrl, deleteTeachesCtrl,
  addBelongsToCtrl, getBelongsToCtrl, deleteBelongsToCtrl,
  addMemberOfCtrl, getMemberOfCtrl, deleteMemberOfCtrl,
  addPrerequisiteOfCtrl, getPrerequisiteOfCtrl, deletePrerequisiteOfCtrl,
  addAdvisedByCtrl, getAdvisedByCtrl, deleteAdvisedByCtrl,
  getAdvisedStudentsWithPrereqsCtrl, getDepartmentInfluenceCtrl
} from './controllers/academicNetworkController';

// 1. Configuration & Env
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Databases
connectDB(); // MongoDB
connectCassandra(); // Cassandra
checkInfluxConnection(); // InfluxDB
connectRedis(); // Redis

// 2. Neo4j Driver Connection logic
let driver: Driver;
try {
  driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(
      process.env.NEO4J_USER || 'neo4j',
      process.env.NEO4J_PASSWORD || '123456789'
    )
  );

  driver.verifyConnectivity()
    .then(() => console.log('✅ Neo4j connection successful'))
    .catch(err => {
      console.error('❌ Neo4j connection failed:', err.message);
    });
} catch (error: any) {
  console.error('❌ Failed to create Neo4j driver:', error.message);
}

// 3. Middlewares
app.use(cors({
  exposedHeaders: ['X-Cache']
})); // Enable CORS requests from frontend and expose cache status
app.use(express.json());

// 4. Routes Definition (Neo4j)
const neoRouter = express.Router();

// --- Nodes CRUD ---
neoRouter.post('/students', createStudentCtrl);
neoRouter.get('/students', getAllStudentsCtrl);
neoRouter.get('/students/:id', getStudentByIdCtrl);
neoRouter.put('/students/:id', updateStudentCtrl);
neoRouter.delete('/students/:id', deleteStudentCtrl);

neoRouter.post('/instructors', createInstructorCtrl);
neoRouter.get('/instructors', getAllInstructorsCtrl);
neoRouter.get('/instructors/:id', getInstructorByIdCtrl);
neoRouter.put('/instructors/:id', updateInstructorCtrl);
neoRouter.delete('/instructors/:id', deleteInstructorCtrl);

neoRouter.post('/courses', createCourseCtrl);
neoRouter.get('/courses', getAllCoursesCtrl);
neoRouter.get('/courses/:id', getCourseByIdCtrl);
neoRouter.put('/courses/:id', updateCourseCtrl);
neoRouter.delete('/courses/:id', deleteCourseCtrl);

neoRouter.post('/departments', createDepartmentCtrl);
neoRouter.get('/departments', getAllDepartmentsCtrl);
neoRouter.get('/departments/:id', getDepartmentByIdCtrl);
neoRouter.put('/departments/:id', updateDepartmentCtrl);
neoRouter.delete('/departments/:id', deleteDepartmentCtrl);

// --- Relationships CRUD ---
neoRouter.post('/relationships/takes', addTakesCtrl);
neoRouter.get('/relationships/takes/:studentId', getTakesCtrl);
neoRouter.put('/relationships/takes/:studentId/:courseId', updateTakesCtrl);
neoRouter.delete('/relationships/takes/:studentId/:courseId', deleteTakesCtrl);

neoRouter.post('/relationships/teaches', addTeachesCtrl);
neoRouter.get('/relationships/teaches/:instructorId', getTeachesCtrl);
neoRouter.put('/relationships/teaches/:instructorId/:courseId', updateTeachesCtrl);
neoRouter.delete('/relationships/teaches/:instructorId/:courseId', deleteTeachesCtrl);

neoRouter.post('/relationships/belongs-to', addBelongsToCtrl);
neoRouter.get('/relationships/belongs-to/:courseId', getBelongsToCtrl);
neoRouter.delete('/relationships/belongs-to/:courseId/:departmentId', deleteBelongsToCtrl);

neoRouter.post('/relationships/member-of', addMemberOfCtrl);
neoRouter.get('/relationships/member-of/:instructorId', getMemberOfCtrl);
neoRouter.delete('/relationships/member-of/:instructorId/:departmentId', deleteMemberOfCtrl);

neoRouter.post('/relationships/prerequisite-of', addPrerequisiteOfCtrl);
neoRouter.get('/relationships/prerequisite-of/:prereqCourseId', getPrerequisiteOfCtrl);
neoRouter.delete('/relationships/prerequisite-of/:prereqCourseId/:dependentCourseId', deletePrerequisiteOfCtrl);

neoRouter.post('/relationships/advised-by', addAdvisedByCtrl);
neoRouter.get('/relationships/advised-by/:studentId', getAdvisedByCtrl);
neoRouter.delete('/relationships/advised-by/:studentId/:instructorId', deleteAdvisedByCtrl);

// --- Complex Query ---
neoRouter.get('/complex/advised-students-by-course-prereqs/:courseId', getAdvisedStudentsWithPrereqsCtrl);
neoRouter.get('/stats/department-influence', getDepartmentInfluenceCtrl);

// 4.1 Routes Definition (Mongo & Unified)
const mongoRouter = express.Router();
const studentController = new StudentController();

mongoRouter.get('/students', (req, res) => studentController.getAll(req, res));
mongoRouter.get('/students/:id', (req, res) => studentController.getById(req, res));
mongoRouter.post('/students', (req, res) => studentController.create(req, res));
mongoRouter.delete('/students/:id', (req, res) => studentController.delete(req, res));
mongoRouter.post('/students/:id/enroll', (req, res) => studentController.addEnrollment(req, res));
mongoRouter.get('/stats/departments', (req, res) => studentController.getStats(req, res));
mongoRouter.get('/stats/course-enrollments', (req, res) => studentController.getEnrollmentStats(req, res));
mongoRouter.get('/stats/avg-gpa', (req, res) => studentController.getAvgGpaStats(req, res));

// Unified Enrollment (Neo4j + Mongo + Influx)
app.post('/api/enroll', (req, res) => studentController.unifiedEnroll(req, res));
// Recommended Peers (Neo4j)
neoRouter.get('/recommendations/peers/:studentId', (req, res) => studentController.getRecommendedPeers(req, res));
// Suggested Mentors (Neo4j)
neoRouter.get('/recommendations/mentors/:studentId', (req, res) => studentController.getSuggestedMentors(req, res));

// Redis Cache Management
app.post('/api/redis/flush', async (req, res) => {
    try {
        await redisService.flush();
        res.json({ message: 'Cache flushed' });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/redis/keys', async (req, res) => {
    try {
        const keys = await redisService.getKeys();
        res.json({ keys });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// 4.2 Routes Definition (Cassandra)
const cassandraRouter = express.Router();
const cassandraController = new CassandraController();

cassandraRouter.post('/analytics', (req, res) => cassandraController.storeAnalytics(req, res));
cassandraRouter.get('/analytics', (req, res) => cassandraController.getAnalytics(req, res));
cassandraRouter.get('/stats/global-gpa', async (req, res) => {
    try {
        const stats = await cassandraService.getGlobalGpaStats();
        res.json(stats);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// 4.3 Routes Definition (InfluxDB)
const influxRouter = express.Router();
const influxController = new InfluxController();

influxRouter.post('/metrics', (req, res) => influxController.writeMetric(req, res));
influxRouter.get('/metrics/:studentId', (req, res) => influxController.getMetrics(req, res));
influxRouter.get('/stats/peak-hours', (req, res) => influxController.getPeakHours(req, res));

// 5. Mount Router & Main Routes
app.use('/api/neo4j', neoRouter);
app.use('/api/mongo', mongoRouter);
app.use('/api/cassandra', cassandraRouter);
app.use('/api/influx', influxRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Academic Network API (Neo4j, Mongo, Cassandra, Influx) is RUNNING! 🎉</h1>');
});

// 6. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

export { driver };