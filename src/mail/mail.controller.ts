import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './mail.service';
import { SendEmailForgotPasswordDto } from './dto/send-email-forgot-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  @Post('forgot-password')
  async sendEmailForgotPassword(
    @Body() sendEmailForgotPassword: SendEmailForgotPasswordDto,
  ) {
    const user = await this.usersRepository.findOne({
      where: { email: sendEmailForgotPassword.to },
    });

    if (!user) {
      return { message: 'Email not found' };
    }

    await this.emailService.sendEmailForgotPassword(
      sendEmailForgotPassword,
      user,
    );
    return { message: 'Email sent successfully' };
  }
}
