import { IsEmail, Length, Matches } from 'class-validator';

export class CreateUserDto {
  name: string;
  // Username can only contain letters, numbers and underscores and must be between 3 and 20 characters
  @Matches(/^[a-zA-Z0-9_]{3,20}$/, {
    message: 'Username can only contain letters, numbers and underscores',
  })
  username: string;
  @Length(8)
  // Password must contain at least 8 characters and one number, password can contain spaces and special characters
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Password must contain at least 8 characters and one number',
  })
  password: string;
  // retypePassword is not a database column, it is used to compare with password
  @Length(8)
  retypePassword: string;
  @IsEmail()
  email: string;
}
