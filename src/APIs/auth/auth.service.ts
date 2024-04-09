import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtDto } from './dtos/jwt.dto';
import { MailsService } from '../mails/mails.service';
import { v4 as uuidv4 } from 'uuid';
import { CheckEmailDto } from './dtos/checkEmail.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailsService: MailsService,
  ) {}

  async getJWT(jwtDto: JwtDto) {
    const user = await this.validateUser(jwtDto);
    const accessToken = await this.generateAccessToken(user); // AccessToken 생성
    const refreshToken = await this.generateRefreshToken(user); // refreshToken 생성
    return { accessToken, refreshToken };
  }

  async validateEmail({ email }) {
    const code = await this.mailsService.saveCode({ email });
    await this.mailsService.sendEmail({
      email,
      code,
      filename: 'email',
    });
  }

  async checkEmail({ email, code }) {
    await this.mailsService.checkCode({ email, code });
    await this.usersService.toggleVerfied({ email });
  }

  async validateUser(jwtDto: JwtDto) {
    let user = await this.usersService.findUserByEmailWithToken({
      email: jwtDto.email,
    }); // 유저 조회
    if (!user) {
      // 회원 가입 로직
      user = await this.usersService.create(jwtDto);
    }
    return user;
  }

  async clearpw(dto: CheckEmailDto) {
    const password = uuidv4().substring(0, 6);
    await this.usersService.updatePW({ email: dto.email, password });
    await this.mailsService.sendEmail({
      email: dto.email,
      code: password,
      filename: 'pw',
    });
  }

  async generateAccessToken(jwtDto: JwtDto) {
    await this.usersService.checkVerified({ email: jwtDto.email });

    const payload = { email: jwtDto.email };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(jwtDto: JwtDto) {
    await this.usersService.checkVerified({ email: jwtDto.email });

    const payload = { email: jwtDto.email };
    const refreshToken = this.jwtService.sign(payload);
    const saltOrRounds = 10;
    const current_refresh_token = await bcrypt.hash(refreshToken, saltOrRounds);

    await this.usersService.setCurrentRefreshToken({
      email: payload.email,
      current_refresh_token,
    });
    return refreshToken;
  }
  async refresh(refreshToken: string): Promise<string> {
    try {
      // 1차 검증
      const decodedRefreshToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const email = decodedRefreshToken.email;

      // 데이터베이스에서 User 객체 가져오기
      const user = await this.usersService.findUserByEmailWithToken(email);

      // 2차 검증
      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.current_refresh_token,
      );

      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid refresh-token');
      }

      // 새로운 accessToken 생성
      const accessToken = this.generateAccessToken(user);

      return accessToken;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }
}
