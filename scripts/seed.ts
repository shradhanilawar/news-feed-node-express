import { AppDataSource } from '../config/data-source';
import { TopicService } from '../services/topic.service';

async function seed() {
  await AppDataSource.initialize();
  const topicService = new TopicService();
  const topics = await topicService.ensureTopics(['AI', 'Technology', 'Finance', 'Sports', 'Politics', 'Health']);
  console.log(`Seeded ${topics.length} topics`);
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
