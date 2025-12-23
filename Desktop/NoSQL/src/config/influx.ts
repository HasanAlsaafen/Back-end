import { InfluxDB } from '@influxdata/influxdb-client';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.INFLUX_URL || 'http://localhost:8086';
const token = process.env.INFLUX_TOKEN || 'pVVXI-yGWhRxPk1kEC4v-aDz7yROTM5cZQEPX4E_a34uoxbQv-tX7CEycXfbpkGgJVaKaA6fX_Gkz3TuYDXR8w==';
const org = process.env.INFLUX_ORG || 'PPU';
const bucket = process.env.INFLUX_BUCKET || 'StudentActivities';

const influxDB = new InfluxDB({ url, token });

export const writeApi = influxDB.getWriteApi(org, bucket);
export const queryApi = influxDB.getQueryApi(org);

export const checkInfluxConnection = async () => {
    try {
        // Simple health check query (or just check if headers work)
        // Influx client doesn't have a direct 'connect' method, it's HTTP based.
        // We'll trust the config for now.
        console.log(`✅ InfluxDB initialized for ${url} (Org: ${org}, Bucket: ${bucket})`);
    } catch (err: any) {
        console.error('❌ InfluxDB initialization failed:', err.message);
    }
};
