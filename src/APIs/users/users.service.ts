import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtDto } from '../auth/dtos/jwt.dto';

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
    console.log(email, password, username);
    return await this.usersRepository.save({
      email,
      password,
      username,
    });
  }

  async setCurrentRefreshToken({ email, current_refresh_token }) {
    const user = await this.findUserByEmailWithToken({ email });
    await this.usersRepository.save({
      ...user,
      current_refresh_token,
    });
  }
}
