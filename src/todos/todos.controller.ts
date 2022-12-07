import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';
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
  @UseGuards(AuthGuardJwt)
  async create(
    @Body() CreateTodoDto: CreateTodoDto,
    @CurrentUser() user: User,
  ) {
    return await this.todosService.createTodo(CreateTodoDto, user);
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
  @UseGuards(AuthGuardJwt)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateTodoDto: UpdateTodoDto,
    @CurrentUser() user: User,
  ) {
    const todo = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!todo) throw new NotFoundException();

    if (todo.userId !== user.id) {
      throw new ForbiddenException(null, 'You are not the owner of this todo');
    }

    return this.todosService.updateTodo(todo, UpdateTodoDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    const todo = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!todo) throw new NotFoundException();

    if (todo.userId !== user.id) {
      throw new ForbiddenException(null, 'You are not the owner of this todo');
    }

    await this.todosService.deleteTodoById(id);
  }
}
