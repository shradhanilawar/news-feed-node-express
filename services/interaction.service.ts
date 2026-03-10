import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Article } from '../entities/Article';
import { UserArticleInteraction } from '../entities/UserArticleInteraction';
import { HttpError } from '../utils/httpError';

export class InteractionService {
  private userRepo = AppDataSource.getRepository(User);
  private articleRepo = AppDataSource.getRepository(Article);
  private interactionRepo = AppDataSource.getRepository(UserArticleInteraction);

  async createInteraction(articleId: string, userId: string, interactionType: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const article = await this.articleRepo.findOne({ where: { id: articleId } });

    if (!user) throw new HttpError(404, 'User not found');
    if (!article) throw new HttpError(404, 'Article not found');

    const interaction = this.interactionRepo.create({ user, article, interactionType });
    return this.interactionRepo.save(interaction);
  }
}
