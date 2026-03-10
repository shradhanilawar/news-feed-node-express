import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Article } from './Article';
import { Topic } from './Topic';

@Entity('article_topics')
@Unique(['article', 'topic'])
export class ArticleTopic {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'float', nullable: true })
  confidenceScore?: number;

  @ManyToOne(() => Article, (article) => article.articleTopics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article!: Article;

  @ManyToOne(() => Topic, (topic) => topic.articleTopics, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id' })
  topic!: Topic;
}
