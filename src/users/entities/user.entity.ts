import { Todo } from 'src/todos/entities/todo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Todo, (todo) => todo.user, {
    eager: true,
  })
  todos: Todo[];

  todosCount?: number;

  todosOpenCount?: number;
  todosInProgressCount?: number;
  todosDoneCount?: number;
}
