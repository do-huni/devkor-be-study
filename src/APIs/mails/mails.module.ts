import * as path from 'path';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailCode } from './entities/emailCode.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailCode]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            user: process.env.EMAILADDRESS,
            pass: process.env.EMAILPASSWORD,
          },
        },
        defaults: {
          from: process.env.EMAILADDRESS,
        },
        template: {
          dir: path.join(__dirname, './templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  controllers: [MailsController],
  providers: [MailsService],
  exports: [MailsService],
})
export class MailsModule {}
