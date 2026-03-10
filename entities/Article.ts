import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Source } from './Source';
import { ArticleSummary } from './ArticleSummary';
import { ArticleTopic } from './ArticleTopic';
import { UserArticleInteraction } from './UserArticleInteraction';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'external_id', nullable: true })
  externalId?: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Index({ unique: true })
  @Column()
  url!: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt?: Date;

  @Column({ default: 'INGESTED' })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Source, (source) => source.articles, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'source_id' })
  source!: Source;

  @OneToOne(() => ArticleSummary, (summary) => summary.article)
  summary?: ArticleSummary;

  @OneToMany(() => ArticleTopic, (articleTopic) => articleTopic.article)
  articleTopics!: ArticleTopic[];

  @OneToMany(() => UserArticleInteraction, (interaction) => interaction.article)
  interactions!: UserArticleInteraction[];
}
