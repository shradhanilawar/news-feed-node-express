import { Request, Response, NextFunction } from 'express';
import { FeedService } from '../services/feed.service';

const feedService = new FeedService();

export async function getFeed(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = String(req.query.userId || '');
    const feed = await feedService.getPersonalizedFeed(userId);
    res.json(feed);
  } catch (error) {
    next(error);
  }
}
