// config/neo4j.ts
import neo4j, { Driver } from 'neo4j-driver';

let driver: Driver | null = null;

try {
  driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(
      process.env.NEO4J_USER || 'neo4j',
      process.env.NEO4J_PASSWORD || '123456789'
    )
  );

  // Test the connection
  driver.verifyConnectivity()
    .then(() => console.log('✅ Neo4j connection successful'))
    .catch(err => {
      console.error('❌ Neo4j connection failed:', err.message);
      process.exit(1); // Exit if can't connect
    });

} catch (error: any) {
  console.error('❌ Failed to create Neo4j driver:', error.message);
  process.exit(1);
}

if (!driver) {
  console.error('Driver not initialized');
  process.exit(1);
}

export default driver;