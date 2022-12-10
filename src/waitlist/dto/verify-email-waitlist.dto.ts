import { IsEmail } from 'class-validator';

export class VerifyEmailWaitlistDto {
  @IsEmail()
  email: string;
}
