import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private getUsersBaseQuery() {
    return this.usersRepository.createQueryBuilder('u').orderBy('u.id', 'DESC');
  }

  public async create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  public async findAll() {
    return this.usersRepository.find();
  }

  private getUsersWithTodosCount() {
    return this.getUsersBaseQuery()
      .loadRelationCountAndMap('u.todosCount', 'u.todos')
      .loadRelationCountAndMap('u.todosOpenCount', 'u.todos', 'todos', (qb) =>
        qb.andWhere('todos.status = :status', { status: 'OPEN' }),
      )
      .loadRelationCountAndMap(
        'u.todosInProgressCount',
        'u.todos',
        'todos',
        (qb) =>
          qb.andWhere('todos.status = :status', { status: 'IN_PROGRESS' }),
      )
      .loadRelationCountAndMap('u.todosDoneCount', 'u.todos', 'todos', (qb) =>
        qb.andWhere('todos.status = :status', { status: 'DONE' }),
      );
  }

  public async getUser(id: number) {
    const query = this.getUsersWithTodosCount().andWhere('u.id = :id', { id });

    return await query.getOne();
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  public async remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
