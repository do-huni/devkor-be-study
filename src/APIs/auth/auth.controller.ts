import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Render,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtDto } from './dtos/jwt.dto';
import { CheckCodeDto } from './dtos/checkCodeDto';
import { CheckEmailDto } from './dtos/checkEmail.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(301)
  async signup(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: JwtDto,
  ) {
    await this.authService.validateUser(body);
    await this.authService.validateEmail({
      email: body.email,
    });
    return res.redirect('signup/email');
  }

  @Post('clearpw')
  async clearpw(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: CheckEmailDto,
  ) {
    await this.authService.clearpw(body);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('isLoggedIn');
    return { message: 'completed' };
  }

  @Post('signin')
  async getJWT(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: JwtDto,
  ) {
    const { accessToken, refreshToken } = await this.authService.getJWT(body);
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.cookie('isLoggedIn', true, { httpOnly: false });
    return res.send();
  }

  @Get('signup/email')
  @Render('emailCodeVerify')
  async checkSignupEmail() {}

  @Post('signup/email')
  async verifyEmail(@Body() body: CheckCodeDto) {
    console.log(body);
    await this.authService.checkEmail(body);
    return { message: 'completed ' };
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
