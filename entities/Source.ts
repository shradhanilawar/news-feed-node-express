import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from './Article';

@Entity('sources')
export class Source {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column()
  type!: string;

  @Column({ name: 'base_url', nullable: true })
  baseUrl?: string;

  @OneToMany(() => Article, (article) => article.source)
  articles!: Article[];
}
