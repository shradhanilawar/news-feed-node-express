import { User } from '../entities/User';
import { AppDataSource } from '../config/data-source';
import { UserTopic } from '../entities/UserTopic';
import { TopicService } from './topic.service';
import { HttpError } from '../utils/httpError';

export class UserService {
  private userRepo = AppDataSource.getRepository(User);
  private userTopicRepo = AppDataSource.getRepository(UserTopic);
  private topicService = new TopicService();

  async createUser(payload: { name: string; email: string }) {
    const existing = await this.userRepo.findOne({ where: { email: payload.email } });
    if (existing) {
      throw new HttpError(409, 'User with this email already exists');
    }

    const user = this.userRepo.create(payload);
    return this.userRepo.save(user);
  }

  async setUserTopics(userId: string, topicNames: string[]) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    const topics = await this.topicService.ensureTopics(topicNames);
    const existingMappings = await this.userTopicRepo.find({ where: { user: { id: userId } }, relations: { user: true, topic: true } });
    if (existingMappings.length) {
      await this.userTopicRepo.remove(existingMappings);
    }

    const mappings = topics.map((topic) => this.userTopicRepo.create({ user, topic }));
    await this.userTopicRepo.save(mappings);

    return this.getUserWithTopics(userId);
  }

  async getUserWithTopics(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { userTopics: { topic: true } },
    });

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      topics: user.userTopics.map((item) => item.topic.name),
      createdAt: user.createdAt,
    };
  }
}
