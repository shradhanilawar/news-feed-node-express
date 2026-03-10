import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/data-source';
import { env } from './config/env';
import router from './routes';
import { errorHandler } from './middleware/errorHandler';
import { TopicService } from './services/topic.service';

async function bootstrap() {
  await AppDataSource.initialize();

  const topicService = new TopicService();
  await topicService.ensureTopics(['AI', 'Technology', 'Finance', 'Sports', 'Politics', 'Health']);

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api', router);
  app.use(errorHandler);

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start application', error);
  process.exit(1);
});
