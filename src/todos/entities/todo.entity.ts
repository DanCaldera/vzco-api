import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TodoStatusEnum {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  title: string;

  @Column('varchar', {
    length: 500,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: TodoStatusEnum,
    default: TodoStatusEnum.OPEN,
  })
  status: TodoStatusEnum;

  @Column({
    type: 'date',
    nullable: true,
  })
  dueDate: Date;

  @ManyToOne(() => User, (user) => user.todos, {
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
