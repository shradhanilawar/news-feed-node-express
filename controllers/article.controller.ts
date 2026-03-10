import { Request, Response, NextFunction } from 'express';
import { ArticleService } from '../services/article.service';
import { NewsService } from '../services/news.service';

const articleService = new ArticleService();
const newsService = new NewsService();

export async function ingestArticles(_req: Request, res: Response, next: NextFunction) {
  try {
    const news = await newsService.fetchLatestNews();
    const result = await articleService.ingestArticles(news);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function listArticles(_req: Request, res: Response, next: NextFunction) {
  try {
    const articles = await articleService.listArticles();
    res.json(articles);
  } catch (error) {
    next(error);
  }
}

export async function summarizeArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await articleService.summarizeArticle(req.params.articleId as string);
    res.json(article);
  } catch (error) {
    next(error);
  }
}
