import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailCode } from './entities/emailCode.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MailsService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(EmailCode)
    private readonly emailCodesRepository: Repository<EmailCode>,
  ) {}

  async saveCode({ email }) {
    const uuid = uuidv4().substring(0, 6);
    this.emailCodesRepository.save({ email, uuid });
    return uuid;
  }

  async checkCode({ email, code }) {
    const _code = await this.emailCodesRepository.findOne({
      where: { email, uuid: code },
    });
    if (!_code) {
      throw new NotFoundException('존재하지 않는 이메일 코드입니다.');
    }
    if (_code.uuid != code) {
      throw new UnauthorizedException('코드가 다릅니다.');
    }
  }

  async sendEmail({ email, code, filename }) {
    await this.mailerService
      .sendMail({
        to: email,
        subject: '이메일 인증',
        template: `../../../../public/templates/${filename}`,
        context: {
          code,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
