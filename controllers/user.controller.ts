import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUserTopics(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.setUserTopics(req.params.userId as string, req.body.topics || []);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.getUserWithTopics(req.params.userId as string);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
