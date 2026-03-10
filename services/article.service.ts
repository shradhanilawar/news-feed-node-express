import { AppDataSource } from '../config/data-source';
import { Article } from '../entities/Article';
import { ArticleSummary } from '../entities/ArticleSummary';
import { ArticleTopic } from '../entities/ArticleTopic';
import { Source } from '../entities/Source';
import { Topic } from '../entities/Topic';
import { inferTopicNames } from '../utils/topicClassifier';
import { generateSummary } from '../utils/summarizer';
import { TopicService } from './topic.service';
import { HttpError } from '../utils/httpError';

export type IngestArticleInput = {
  sourceName: string;
  sourceType: string;
  sourceBaseUrl?: string;
  externalId?: string;
  title: string;
  description?: string;
  content?: string;
  url: string;
  imageUrl?: string;
  publishedAt?: Date;
};

export class ArticleService {
  private sourceRepo = AppDataSource.getRepository(Source);
  private articleRepo = AppDataSource.getRepository(Article);
  private articleSummaryRepo = AppDataSource.getRepository(ArticleSummary);
  private articleTopicRepo = AppDataSource.getRepository(ArticleTopic);
  private topicService = new TopicService();

  async ingestArticles(inputs: IngestArticleInput[]) {
    let createdCount = 0;

    for (const input of inputs) {
      const source = await this.ensureSource(input.sourceName, input.sourceType, input.sourceBaseUrl);
      const existing = await this.articleRepo.findOne({ where: { url: input.url } });
      if (existing) continue;

      const article = this.articleRepo.create({
        source,
        externalId: input.externalId,
        title: input.title,
        description: input.description,
        content: input.content,
        url: input.url,
        imageUrl: input.imageUrl,
        publishedAt: input.publishedAt,
        status: 'INGESTED',
      });

      const saved = await this.articleRepo.save(article);
      await this.attachTopicsAndSummary(saved);
      createdCount += 1;
    }

    return { createdCount, totalReceived: inputs.length };
  }

  async listArticles() {
    return this.articleRepo.find({
      relations: { summary: true, articleTopics: { topic: true } },
      order: { publishedAt: 'DESC', createdAt: 'DESC' },
    });
  }

  async summarizeArticle(articleId: string) {
    const article = await this.articleRepo.findOne({
      where: { id: articleId },
      relations: { source: true, summary: true, articleTopics: { topic: true } },
    });

    if (!article) {
      throw new HttpError(404, 'Article not found');
    }

    await this.attachTopicsAndSummary(article, true);

    return this.articleRepo.findOne({
      where: { id: articleId },
      relations: { source: true, summary: true, articleTopics: { topic: true } },
    });
  }

  private async ensureSource(name: string, type: string, baseUrl?: string) {
    let source = await this.sourceRepo.findOne({ where: { name } });
    if (!source) {
      source = this.sourceRepo.create({ name, type, baseUrl });
      source = await this.sourceRepo.save(source);
    }
    return source;
  }

  private async attachTopicsAndSummary(article: Article, forceRefresh = false) {
    const fullText = [article.title, article.description, article.content].filter(Boolean).join(' ');
    const topicNames = inferTopicNames(fullText);
    const topics = await this.topicService.ensureTopics(topicNames);

    if (forceRefresh) {
      const existingTopics = await this.articleTopicRepo.find({ where: { article: { id: article.id } }, relations: { article: true, topic: true } });
      if (existingTopics.length) {
        await this.articleTopicRepo.remove(existingTopics);
      }
      const existingSummary = await this.articleSummaryRepo.findOne({ where: { article: { id: article.id } }, relations: { article: true } });
      if (existingSummary) {
        await this.articleSummaryRepo.remove(existingSummary);
      }
    }

    const existingTopicRows = await this.articleTopicRepo.find({ where: { article: { id: article.id } } });
    if (!existingTopicRows.length || forceRefresh) {
      const articleTopics = topics.map((topic: Topic) =>
        this.articleTopicRepo.create({
          article,
          topic,
          confidenceScore: 0.8,
        }),
      );
      await this.articleTopicRepo.save(articleTopics);
    }

    const existingSummary = await this.articleSummaryRepo.findOne({ where: { article: { id: article.id } } });
    if (!existingSummary || forceRefresh) {
      const summary = this.articleSummaryRepo.create({
        article,
        summaryText: generateSummary({
          title: article.title,
          description: article.description,
          content: article.content,
        }),
        providerName: 'local-mock-summarizer',
        modelName: 'rules-v1',
      });
      await this.articleSummaryRepo.save(summary);
    }

    article.status = 'SUMMARIZED';
    await this.articleRepo.save(article);
  }
}
