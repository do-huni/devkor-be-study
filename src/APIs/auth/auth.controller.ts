import {
  Controller,
  Get,
  HttpCode,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao') // 카카오 서버를 거쳐서 도착하게 될 엔드포인트
  @UseGuards(AuthGuard('kakao')) // kakao.strategy를 실행시켜 줍니다.
  @HttpCode(301)
  async kakaoLogin(@Req() req: Request, @Res() res: Response) {
    // console.log(req.user);
    const { accessToken, refreshToken } = await this.authService.getJWT({
      kakaoId: req.user.kakaoId,
      username: req.user.username,
      profile_image: req.user.profile_image,
    });
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('isLoggedIn', true, { httpOnly: false });
    return res.redirect(process.env.CLIENT_URL);
  }

  @Get('refresh')
  @HttpCode(201)
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const newAccessToken = await this.authService.refresh(
        req.cookies.refreshToken,
      );
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
      });
      return res.send();
    } catch (e) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.clearCookie('isLoggedIn');
      throw new UnauthorizedException(e.message);
    }
  }
}
