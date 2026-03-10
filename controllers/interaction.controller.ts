import { Request, Response, NextFunction } from 'express';
import { InteractionService } from '../services/interaction.service';

const interactionService = new InteractionService();

export async function createInteraction(req: Request, res: Response, next: NextFunction) {
  try {
    const interaction = await interactionService.createInteraction(
      req.params.articleId as string,
      req.body.userId,
      req.body.interactionType,
    );
    res.status(201).json(interaction);
  } catch (error) {
    next(error);
  }
}
