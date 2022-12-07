import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginationOptions } from 'src/pagination/paginator';
import { Repository } from 'typeorm';
import { dueDateFilterEnum, ListTodosDto } from './dto/list.todos.dto';
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

  private getTodosFiltered(filter?: ListTodosDto) {
    const query = this.getTodosBaseQuery();

    if (filter?.dueDate) {
      if (filter.dueDate === dueDateFilterEnum.TODAY) {
        query.andWhere('t.dueDate = :dueDate', {
          dueDate: new Date().toISOString().split('T')[0],
        });
      } else if (filter.dueDate === dueDateFilterEnum.TOMORROW) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        query.andWhere('t.dueDate = :dueDate', {
          dueDate: tomorrow.toISOString().split('T')[0],
        });
      } else if (filter.dueDate === dueDateFilterEnum.THIS_WEEK) {
        const today = new Date();
        const thisWeek = new Date(
          today.setDate(today.getDate() - today.getDay()),
        );
        query.andWhere('t.dueDate >= :dueDate', {
          dueDate: thisWeek.toISOString().split('T')[0],
        });
      } else if (filter.dueDate === dueDateFilterEnum.THIS_MONTH) {
        const today = new Date();
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        query.andWhere('t.dueDate >= :dueDate', {
          dueDate: thisMonth.toISOString().split('T')[0],
        });
      } else if (filter.dueDate === dueDateFilterEnum.NEXT_MONTH) {
        const today = new Date();
        const nextMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          1,
        );
        query.andWhere('t.dueDate >= :dueDate', {
          dueDate: nextMonth.toISOString().split('T')[0],
        });
      } else if (filter.dueDate === dueDateFilterEnum.THIS_YEAR) {
        const today = new Date();
        const thisYear = new Date(today.getFullYear(), 0, 1);
        query.andWhere('t.dueDate >= :dueDate', {
          dueDate: thisYear.toISOString().split('T')[0],
        });
      } else if (filter.dueDate === dueDateFilterEnum.OVERDUE) {
        query.andWhere('t.dueDate < :dueDate', {
          dueDate: new Date().toISOString().split('T')[0],
        });
      }
    }

    return query;
  }

  public async getTodosFilteredPaginated(
    filter?: ListTodosDto,
    paginateOptions?: PaginationOptions,
  ) {
    return await paginate(this.getTodosFiltered(filter), paginateOptions);
  }

  public async getTodo(id: number): Promise<Todo | undefined> {
    const query = this.getTodosBaseQuery().andWhere('t.id = :id', { id });

    this.logger.debug(query.getSql());

    return await query.getOne();
  }
}
