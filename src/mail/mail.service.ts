import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailForgotPasswordDto } from './dto/send-email-forgot-password.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailForgotPassword(
    sendEmailForgotPasswordDto: SendEmailForgotPasswordDto,
    user: User,
  ) {
    this.mailerService.sendMail({
      to: sendEmailForgotPasswordDto.to,
      subject: 'Forgot password',
      template: 'forgot-password',
      context: {
        link: `${process.env.APP_URL}/auth/change-password?token=${user.emailVerificationToken}&email=${user.email}`,
      },
    });
  }
}
