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
import { randomBytes } from 'crypto';

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
  role: string;

  @Column({
    nullable: false,
    default: randomBytes(100).toString('hex'),
  })
  emailVerificationToken: string;

  @OneToMany(() => Todo, (todo) => todo.user, {
    eager: true,
  })
  todos: Todo[];

  @OneToOne(() => UserDetails, (userDetails) => userDetails.user)
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
