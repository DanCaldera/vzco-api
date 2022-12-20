import { IsEmail } from 'class-validator';

export class SendEmailForgotPasswordDto {
  @IsEmail({}, { message: 'El email no es válido' })
  to: string;
}
