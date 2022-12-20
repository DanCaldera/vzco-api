import { IsEmail, Length, Matches } from 'class-validator';

export class changePasswordDto {
  token: string;
  @IsEmail(
    {},
    {
      message: 'El email no es válido',
    },
  )
  email: string;
  @Length(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, {
    message: 'Password must contain at least 8 characters and one number',
  })
  password: string;
}
