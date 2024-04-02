import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { FavorsService } from './favors.service';
import { ToggleFavorDto } from './dtos/toggle-favor.dto';
@Controller('favors')
export class FavorsController {
  constructor(private readonly favorsService: FavorsService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Post()
  async toggleFavor(@Body() body: ToggleFavorDto, @Req() req: Request) {
    const email = req.user.email;
    const id = body.id;
    return this.favorsService.toggleFavor({ id, email });
  }

  @HttpCode(200)
  @Get(':id')
  async fetchFavors(@Param('id') id: number) {
    return await this.favorsService.fetchFavors({ id });
  }
}
