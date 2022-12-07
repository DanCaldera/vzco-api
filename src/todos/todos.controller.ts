import {
  Body,
  ClassSerializerInterceptor,
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
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodosService } from './todos.service';

@Controller('todos')
@SerializeOptions({
  strategy: 'excludeAll',
})
export class TodosController {
  private readonly logger = new Logger(TodosController.name);

  constructor(private readonly todosService: TodosService) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body() CreateTodoDto: CreateTodoDto,
    @CurrentUser() user: User,
  ) {
    return await this.todosService.createTodo(CreateTodoDto, user);
  }

  // @Get()
  // @UsePipes(new ValidationPipe({ transform: true }))
  // @UseInterceptors(ClassSerializerInterceptor)
  // async findAll(@Query() filter: ListTodosDto) {
  //   this.logger.log('Hit the findAll endpoint');
  //   const todos = await this.todosService.getTodosFilteredPaginated(filter, {
  //     currentPage: filter.page,
  //     total: true,
  //     limit: 10,
  //   });
  //   return todos;
  // }

  // @Get(':id')
  // @UseInterceptors(ClassSerializerInterceptor)
  // async findOne(@Param('id', ParseIntPipe) id: number) {
  //   const todo = await this.todosService.getTodo(id);

  //   if (!todo) throw new NotFoundException();

  //   return todo;
  // }

  @Get('user/:id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findUserTodos(
    @Param('id', ParseIntPipe) id: number,
    @Query() { page = 1 },
  ) {
    const todos = await this.todosService.getTodosByUserIdPaginated(id, {
      currentPage: page,
      total: true,
      limit: 10,
    });

    if (!todos) throw new NotFoundException();

    return todos;
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateTodoDto: UpdateTodoDto,
    @CurrentUser() user: User,
  ) {
    const todo = await this.todosService.getTodo(id);

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
    const todo = await this.todosService.getTodo(id);

    if (!todo) throw new NotFoundException();

    if (todo.userId !== user.id) {
      throw new ForbiddenException(null, 'You are not the owner of this todo');
    }

    await this.todosService.deleteTodoById(id);
  }
}
