import { Controller } from '@nestjs/common';
import { MailsService } from './mails.service';

@Controller('mail')
export class MailsController {
  constructor(private readonly userService: MailsService) {}
}
