import { Expose } from 'class-transformer';
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
  constructor(partial?: Partial<Event>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column('varchar', { length: 100 })
  @Expose()
  title: string;

  @Column('varchar', {
    length: 500,
    nullable: true,
  })
  @Expose()
  description: string;

  @Column({
    type: 'enum',
    enum: TodoStatusEnum,
    default: TodoStatusEnum.OPEN,
  })
  @Expose()
  status: TodoStatusEnum;

  @Column({
    type: 'date',
    nullable: true,
  })
  @Expose()
  dueDate: Date;

  @ManyToOne(() => User, (user) => user.todos, {
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}
