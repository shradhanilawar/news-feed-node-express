import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserTopic } from './UserTopic';
import { ArticleTopic } from './ArticleTopic';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => UserTopic, (userTopic) => userTopic.topic)
  userTopics!: UserTopic[];

  @OneToMany(() => ArticleTopic, (articleTopic) => articleTopic.topic)
  articleTopics!: ArticleTopic[];
}
