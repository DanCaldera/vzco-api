import { Length } from 'class-validator';

export class CreateTodoDto {
  @Length(1, 100, {
    message: 'El título debe tener entre 1 y 100 caracteres',
  })
  title: string;
  description: string;
  status: string;
  dueDate: string;
}
