import { In } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Topic } from '../entities/Topic';

export class TopicService {
  private topicRepo = AppDataSource.getRepository(Topic);

  async ensureTopics(names: string[]): Promise<Topic[]> {
    const uniqueNames = [...new Set(names.map((name) => name.trim()).filter(Boolean))];
    if (!uniqueNames.length) return [];

    const existing = await this.topicRepo.find({ where: { name: In(uniqueNames) } });
    const existingNames = new Set(existing.map((topic) => topic.name));

    const missing = uniqueNames
      .filter((name) => !existingNames.has(name))
      .map((name) => this.topicRepo.create({ name }));

    if (missing.length) {
      await this.topicRepo.save(missing);
    }

    return this.topicRepo.find({ where: { name: In(uniqueNames) }, order: { name: 'ASC' } });
  }

  async listTopics(): Promise<Topic[]> {
    return this.topicRepo.find({ order: { name: 'ASC' } });
  }
}
