import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from './Article';

@Entity('article_summaries')
export class ArticleSummary {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  summaryText!: string;

  @Column()
  providerName!: string;

  @Column()
  modelName!: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  generatedAt!: Date;

  @OneToOne(() => Article, (article) => article.summary, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article!: Article;
}
