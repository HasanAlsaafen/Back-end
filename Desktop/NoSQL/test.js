const cassandra = require('cassandra-driver');

// إعداد العميل
const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'university'
});

async function run() {
  try {
    console.log("⏳ جاري الاتصال بكاساندرا...");
    await client.connect();
    console.log("✅ متصل بنجاح!");

    // 1. إدخال بيانات (Insert)
    const insertQuery = 'INSERT INTO student_logs (student_id, event_time, action_type, module_name) VALUES (?, toTimestamp(now()), ?, ?)';
    const studentId = "mongo_user_12345"; // معرف نصي كما في MongoDB
    
    console.log("✍️ جاري تسجيل نشاط تجريبي...");
    await client.execute(insertQuery, [studentId, 'LOGIN', 'Mobile_App'], { prepare: true });

    // 2. قراءة البيانات (Select)
    console.log("🔍 جاري استرجاع البيانات للتأكد...");
    const selectQuery = 'SELECT * FROM student_logs WHERE student_id = ?';
    const result = await client.execute(selectQuery, [studentId], { prepare: true });

    console.log("\n📊 البيانات الموجودة في Cassandra:");
    console.table(result.rows);

  } catch (err) {
    console.error("❌ فشل الاختبار:", err);
  } finally {
    await client.shutdown();
    console.log("🔌 تم إغلاق الاتصال.");
  }
}

run();