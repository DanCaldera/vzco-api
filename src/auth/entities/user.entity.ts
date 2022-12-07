import { Todo } from 'src/todos/entities/todo.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserDetails } from './user.details.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @OneToMany(() => Todo, (todo) => todo.user, {
    eager: true,
  })
  todos: Todo[];

  @OneToOne(() => UserDetails, (userDetails) => userDetails.user, {
    eager: true,
  })
  details: UserDetails;

  todosCount?: number;

  todosOpenCount?: number;
  todosInProgressCount?: number;
  todosDoneCount?: number;
}
