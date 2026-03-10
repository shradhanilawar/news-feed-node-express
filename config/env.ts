import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'news_feed',
  },
  newsApi: {
    url: process.env.NEWS_API_URL || 'https://newsapi.org/v2/top-headlines',
    key: process.env.NEWS_API_KEY || '',
    country: process.env.NEWS_COUNTRY || 'us',
    category: process.env.NEWS_CATEGORY || 'technology',
  },
};
