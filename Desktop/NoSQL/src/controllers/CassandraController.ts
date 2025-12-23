import { Request, Response } from 'express';
import { CassandraService } from '../services/CassandraService';

const cassandraService = new CassandraService();

export class CassandraController {
  
  async storeAnalytics(req: Request, res: Response) {
    try {
      const result = await cassandraService.storeAnalytics(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAnalytics(req: Request, res: Response) {
    try {
      const category = req.query.category as string;
      if (!category) return res.status(400).json({ error: "Category required" });
      
      const data = await cassandraService.getAnalytics(category);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
