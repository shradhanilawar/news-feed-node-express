import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { User } from '../entities/User';
import { Topic } from '../entities/Topic';
import { UserTopic } from '../entities/UserTopic';
import { Source } from '../entities/Source';
import { Article } from '../entities/Article';
import { ArticleSummary } from '../entities/ArticleSummary';
import { ArticleTopic } from '../entities/ArticleTopic';
import { UserArticleInteraction } from '../entities/UserArticleInteraction';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: true,
  logging: false,
  entities: [
    User,
    Topic,
    UserTopic,
    Source,
    Article,
    ArticleSummary,
    ArticleTopic,
    UserArticleInteraction,
  ],
});
