import { Request, Response } from 'express';
import { CassandraService } from '../services/CassandraService';
import { redisService } from '../services/RedisService';

const cassandraService = new CassandraService();

export class CassandraController {
  
  async storeAnalytics(req: Request, res: Response) {
    try {
      const result = await cassandraService.storeAnalytics(req.body);
      // Invalidate analytics cache
      await redisService.delByPattern('analytics:*');
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAnalytics(req: Request, res: Response) {
    try {
      const category = req.query.category as string;
      if (!category) return res.status(400).json({ error: "Category required" });
      
      const cacheKey = `analytics:${category}`;
      const cached = await redisService.get(cacheKey);
      if (cached) {
          res.setHeader('X-Cache', 'HIT');
          return res.json(cached);
      }

      const data = await cassandraService.getAnalytics(category);
      await redisService.set(cacheKey, data, 1800); // 30 min cache
      
      res.setHeader('X-Cache', 'MISS');
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
