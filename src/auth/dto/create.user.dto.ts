import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @Length(5)
  name: string;
  @Length(5)
  username: string;
  @Length(8)
  password: string;
  @Length(8)
  retypePassword: string;
  @IsEmail()
  email: string;
}