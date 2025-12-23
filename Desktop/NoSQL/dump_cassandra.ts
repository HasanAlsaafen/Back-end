
import { Client } from "cassandra-driver";

const client = new Client({
  contactPoints: ["127.0.0.1"],
  localDataCenter: "datacenter1",
  keyspace: "university"
});

async function check() {
  await client.connect();
  const result = await client.execute("SELECT * FROM course_activity");
  console.log("Rows found:", result.rowLength);
  result.rows.forEach(row => {
     console.log(JSON.stringify(row));
  });
  process.exit(0);
}

check();
