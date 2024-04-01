import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtDto } from '../auth/dtos/jwt.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findUserByEmail({ email }) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findUserByEmailWithToken({ email }) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async create({ email, password, username }: JwtDto) {
    const saltOrRounds = 10;
    password = await bcrypt.hash(password, saltOrRounds);
    return await this.usersRepository.save({
      email,
      password,
      username,
    });
  }
  async updatePW({ email, password }) {
    const saltOrRounds = 10;
    password = await bcrypt.hash(password, saltOrRounds);
    const user = await this.findUserByEmailWithToken({ email });
    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
    console.log(user);
    return await this.usersRepository.save({
      ...user,
      password,
    });
  }
  async toggleVerfied({ email }) {
    const user = await this.findUserByEmailWithToken({ email });
    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
    await this.usersRepository.save({ ...user, isVerified: true });
  }
  async checkVerified({ email }) {
    const user = await this.findUserByEmailWithToken({ email });
    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
    if (!user.isVerified) {
      throw new UnauthorizedException('이메일 인증이 되지 않았습니다.');
    }
  }
  async setCurrentRefreshToken({ email, current_refresh_token }) {
    const user = await this.findUserByEmailWithToken({ email });
    await this.usersRepository.save({
      ...user,
      current_refresh_token,
    });
  }
}
