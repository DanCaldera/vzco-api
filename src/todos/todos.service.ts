import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);

  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
  ) {}

  private getTodosBaseQuery() {
    return this.todosRepository.createQueryBuilder('t').orderBy('t.id', 'DESC');
  }

  public async getTodo(id: number): Promise<Todo | undefined> {
    const query = this.getTodosBaseQuery().andWhere('t.id = :id', { id });

    this.logger.debug(query.getSql());

    return await query.getOne();
  }
}
