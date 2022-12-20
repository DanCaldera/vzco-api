import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailController } from './mail.controller';
import { EmailService } from './mail.service';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: process.env.SMTP_URL,
        defaults: {
          from: '"vzco" <no-reply@vzco.com>',
        },
        template: {
          dir: process.cwd() + '/src/mail/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class MaileModule {}
