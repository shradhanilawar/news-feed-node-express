import axios from 'axios';
import { env } from '../config/env';
import { IngestArticleInput } from './article.service';

const mockArticles: IngestArticleInput[] = [
  {
    sourceName: 'Mock News',
    sourceType: 'mock',
    sourceBaseUrl: 'https://example.com',
    title: 'OpenAI launches a new AI toolkit for enterprise developers',
    description: 'The toolkit focuses on faster prototyping, governance controls, and easier production rollout.',
    content: 'Enterprise teams are experimenting with AI toolkits that simplify model integration, policy enforcement, and deployment workflows.',
    url: 'https://example.com/ai-toolkit-enterprise',
    imageUrl: 'https://images.example.com/ai-toolkit.jpg',
    publishedAt: new Date(),
  },
  {
    sourceName: 'Mock News',
    sourceType: 'mock',
    sourceBaseUrl: 'https://example.com',
    title: 'Markets react as major bank announces new digital finance platform',
    description: 'Analysts say the finance sector is accelerating cloud-native investments.',
    content: 'The platform includes digital onboarding, payments modernization, and analytics for investment products.',
    url: 'https://example.com/digital-finance-platform',
    imageUrl: 'https://images.example.com/finance-platform.jpg',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    sourceName: 'Mock News',
    sourceType: 'mock',
    sourceBaseUrl: 'https://example.com',
    title: 'Healthcare startup uses machine learning to speed diagnosis support',
    description: 'The startup says hospitals can reduce manual review time using new ML workflows.',
    content: 'Doctors still make final decisions, but the system helps summarize cases and surface relevant medical patterns.',
    url: 'https://example.com/healthcare-ml-diagnosis',
    imageUrl: 'https://images.example.com/healthcare-ml.jpg',
    publishedAt: new Date(Date.now() - 1000 * 60 * 120),
  },
];

export class NewsService {
  async fetchLatestNews(): Promise<IngestArticleInput[]> {
    if (!env.newsApi.key) {
      return mockArticles;
    }

    const response = await axios.get(env.newsApi.url, {
      params: {
        apiKey: env.newsApi.key,
        country: env.newsApi.country,
        category: env.newsApi.category,
        pageSize: 10,
      },
      timeout: 10000,
    });

    const articles = response.data.articles || [];

    return articles
      .filter((item: any) => item.title && item.url)
      .map((item: any) => ({
        sourceName: item.source?.name || 'External News API',
        sourceType: 'api',
        sourceBaseUrl: env.newsApi.url,
        externalId: item.publishedAt || item.url,
        title: item.title,
        description: item.description || '',
        content: item.content || '',
        url: item.url,
        imageUrl: item.urlToImage || '',
        publishedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      }));
  }
}
