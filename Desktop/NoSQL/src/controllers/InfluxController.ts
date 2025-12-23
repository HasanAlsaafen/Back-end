import { Request, Response } from 'express';
import { InfluxService } from '../services/InfluxService';

const influxService = new InfluxService();

export class InfluxController {
  
  async writeMetric(req: Request, res: Response) {
    try {
      const result = await influxService.writeMetric(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMetrics(req: Request, res: Response) {
    try {
      const metrics = await influxService.getMetrics(req.params.studentId);
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPeakHours(req: Request, res: Response) {
      try {
          const stats = await influxService.getPeakActivityHours();
          res.json(stats);
      } catch (error: any) {
          res.status(500).json({ error: error.message });
      }
  }
}
