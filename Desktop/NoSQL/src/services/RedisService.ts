import redisClient from '../config/redis';

export class RedisService {
    async get(key: string): Promise<any | null> {
        try {
            const data = await redisClient.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Redis Get Error [${key}]:`, error);
            return null;
        }
    }

    async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
        try {
            await redisClient.set(key, JSON.stringify(value), {
                EX: ttlSeconds
            });
        } catch (error) {
            console.error(`Redis Set Error [${key}]:`, error);
        }
    }

    async del(key: string): Promise<void> {
        try {
            await redisClient.del(key);
        } catch (error) {
            console.error(`Redis Del Error [${key}]:`, error);
        }
    }

    async delByPattern(pattern: string): Promise<void> {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        } catch (error) {
            console.error(`Redis DelPattern Error [${pattern}]:`, error);
        }
    }

    async flush(): Promise<void> {
        try {
            await redisClient.flushAll();
        } catch (error) {
            console.error('Redis Flush Error:', error);
        }
    }

    async getKeys(pattern: string = '*'): Promise<string[]> {
        try {
            return await redisClient.keys(pattern);
        } catch (error) {
            console.error('Redis GetKeys Error:', error);
            return [];
        }
    }
}

export const redisService = new RedisService();
