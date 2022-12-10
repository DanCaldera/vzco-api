import { Expose } from 'class-transformer';
import { Todo } from 'src/todos/entities/todo.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserDetails } from './user.details.entity';

export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({
    length: 100,
    nullable: true,
  })
  @Expose()
  name: string;

  @Column({
    unique: true,
  })
  @Expose()
  username: string;

  @Column()
  password: string;

  @Column({
    unique: true,
  })
  @Expose()
  email: string;

  @Column({
    default: false,
  })
  @Expose()
  isEmailVerified: boolean;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
    nullable: false,
  })
  @Expose()
  role: string;

  @OneToMany(() => Todo, (todo) => todo.user, {
    eager: true,
  })
  @Expose()
  todos: Todo[];

  @OneToOne(() => UserDetails, (userDetails) => userDetails.user, {
    eager: true,
  })
  @Expose()
  details: UserDetails;

  @Expose()
  todosCount?: number;
  @Expose()
  todosOpenCount?: number;
  @Expose()
  todosInProgressCount?: number;
  @Expose()
  todosDoneCount?: number;
}
