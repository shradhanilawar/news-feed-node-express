import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserTopic } from './UserTopic';
import { UserArticleInteraction } from './UserArticleInteraction';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => UserTopic, (userTopic) => userTopic.user)
  userTopics!: UserTopic[];

  @OneToMany(() => UserArticleInteraction, (interaction) => interaction.user)
  interactions!: UserArticleInteraction[];
}
