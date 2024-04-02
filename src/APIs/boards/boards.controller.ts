import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardsDto } from './dtos/create-boards.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createBoard(
    @Req() req: Request,
    @Body() createBoardDto: CreateBoardsDto,
  ) {
    const email = req.user.email;
    createBoardDto.userEmail = email;
    return await this.boardsService.create(createBoardDto);
  }
}
