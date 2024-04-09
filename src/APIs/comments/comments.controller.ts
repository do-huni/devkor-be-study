import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CreateCommentInput } from './dtos/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async upsertComment(@Req() req: Request, @Body() body: CreateCommentInput) {
    const email = req.user.email;
    return await this.commentsService.upsert({ ...body, email });
  }
}
