import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Controller('todos')
export class TodosController {
  private readonly logger = new Logger(TodosController.name);

  constructor(
    @InjectRepository(Todo)
    private readonly repository: Repository<Todo>,
  ) {}

  @Post()
  async create(@Body() input: CreateTodoDto) {
    return await this.repository.save(input);
  }

  @Get()
  async findAll() {
    this.logger.log('Hit the findAll endpoint');
    const todos = await this.repository.find();
    this.logger.debug(`Found ${todos.length} todos`);
    return todos;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const todo = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!todo) throw new NotFoundException();

    return todo;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() input: UpdateTodoDto) {
    const todo = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!todo) throw new NotFoundException();

    return await this.repository.save({
      ...todo,
      ...input,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const todo = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!todo) throw new NotFoundException();

    await this.repository.remove(todo);
  }
}
