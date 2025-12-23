import { Client } from 'cassandra-driver';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINT || '127.0.0.1'],
  localDataCenter: process.env.CASSANDRA_LOCAL_DC || 'datacenter1',
  keyspace: 'university'
});

export const connectCassandra = async () => {
    try {
        await client.connect();
        console.log('✅ Cassandra connection successful');
    } catch (err: any) {
        console.error('❌ Cassandra connection failed:', err.message);
        // Don't exit process, just log error so other DBs can work
    }
};

import { CassandraService } from '../services/CassandraService';
export const cassandraService = new CassandraService();
export default client;
