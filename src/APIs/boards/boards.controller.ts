import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardsDto } from './dtos/create-boards.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { FetchPostsDto } from './dtos/fetch-posts.dto';

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

  @Get()
  async fetchBoards(@Query() page: FetchPostsDto) {
    return await this.boardsService.fetchBoards(page);
  }
}
