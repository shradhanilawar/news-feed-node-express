import { AppDataSource } from '../config/data-source';
import { Article } from '../entities/Article';
import { UserArticleInteraction } from '../entities/UserArticleInteraction';
import { User } from '../entities/User';
import { HttpError } from '../utils/httpError';

export class FeedService {
  private userRepo = AppDataSource.getRepository(User);
  private articleRepo = AppDataSource.getRepository(Article);
  private interactionRepo = AppDataSource.getRepository(UserArticleInteraction);

  async getPersonalizedFeed(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { userTopics: { topic: true } },
    });

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    const preferredTopics = user.userTopics.map((item) => item.topic.name);
    const interactions = await this.interactionRepo.find({
      where: { user: { id: userId } },
      relations: { article: { articleTopics: { topic: true } } },
    });

    const historyTopicCount = new Map<string, number>();
    interactions.forEach((interaction) => {
      interaction.article.articleTopics.forEach((item) => {
        historyTopicCount.set(item.topic.name, (historyTopicCount.get(item.topic.name) || 0) + 1);
      });
    });

    const articles = await this.articleRepo.find({
      where: { status: 'SUMMARIZED' },
      relations: { source: true, summary: true, articleTopics: { topic: true } },
      order: { publishedAt: 'DESC', createdAt: 'DESC' },
      take: 50,
    });

    const ranked = articles
      .map((article) => {
        const articleTopics = article.articleTopics.map((item) => item.topic.name);
        const preferredMatches = articleTopics.filter((topic) => preferredTopics.includes(topic)).length;
        const historyScore = articleTopics.reduce((acc, topic) => acc + (historyTopicCount.get(topic) || 0), 0);
        const ageHours = article.publishedAt
          ? Math.max(0, (Date.now() - article.publishedAt.getTime()) / (1000 * 60 * 60))
          : 100;
        const recencyScore = Math.max(0, 10 - ageHours / 6);
        const score = preferredMatches * 5 + historyScore * 2 + recencyScore;

        return {
          ...article,
          score: Number(score.toFixed(2)),
        };
      })
      .filter((article) => preferredTopics.length === 0 || article.articleTopics.some((item) => preferredTopics.includes(item.topic.name)))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((article) => ({
        id: article.id,
        title: article.title,
        description: article.description,
        summary: article.summary?.summaryText || null,
        source: article.source.name,
        url: article.url,
        imageUrl: article.imageUrl,
        publishedAt: article.publishedAt,
        topics: article.articleTopics.map((item) => item.topic.name),
        score: article.score,
      }));

    return {
      userId,
      preferredTopics,
      total: ranked.length,
      items: ranked,
    };
  }
}
