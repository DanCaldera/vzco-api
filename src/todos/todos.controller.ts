import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ListTodosDto } from './dto/list.todos.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  private readonly logger = new Logger(TodosController.name);

  constructor(
    @InjectRepository(Todo)
    private readonly repository: Repository<Todo>,
    private readonly todosService: TodosService,
  ) {}

  @Post()
  async create(@Body() CreateTodoDto: CreateTodoDto) {
    return await this.repository.save(CreateTodoDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListTodosDto) {
    this.logger.log('Hit the findAll endpoint');
    const todos = await this.todosService.getTodosFilteredPaginated(filter, {
      currentPage: filter.page,
      total: true,
      limit: 10,
    });
    return todos;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const todo = await this.todosService.getTodo(id);

    if (!todo) throw new NotFoundException();

    return todo;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateTodoDto: UpdateTodoDto,
  ) {
    const todo = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!todo) throw new NotFoundException();

    return await this.repository.save({
      ...todo,
      ...UpdateTodoDto,
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.todosService.deleteTodoById(id);

    if (!result.affected) throw new NotFoundException();
  }
}
