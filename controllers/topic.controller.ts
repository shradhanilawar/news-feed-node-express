import { Request, Response, NextFunction } from 'express';
import { TopicService } from '../services/topic.service';

const topicService = new TopicService();

export async function listTopics(_req: Request, res: Response, next: NextFunction) {
  try {
    const topics = await topicService.listTopics();
    res.json(topics);
  } catch (error) {
    next(error);
  }
}
