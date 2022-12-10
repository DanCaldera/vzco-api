import { IsEmail, Length, Matches } from 'class-validator';

export class CreateUserDto {
  name: string;
  // Username can only contain letters, numbers and underscores and must be between 3 and 20 characters
  @Matches(/^[a-zA-Z0-9_]{3,20}$/, {
    message: 'Username can only contain letters, numbers and underscores',
  })
  username: string;
  @Length(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, {
    message: 'Password must contain at least 8 characters and one number',
  })
  password: string;
  @IsEmail()
  email: string;
}
