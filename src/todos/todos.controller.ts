import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Controller('todos')
export class TodosController {
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
    return await this.repository.find();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.repository.findOne({
      where: {
        id,
      },
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() input: UpdateTodoDto) {
    return await this.repository.update(id, input);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.repository.delete(id);
  }
}
