import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { CreateBoardsDto } from './dtos/create-boards.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>,
    private readonly usersService: UsersService,
  ) {}
  async create(createBoardDto: CreateBoardsDto) {
    const userId = await this.usersService.getIdFromEmail({
      email: createBoardDto.userEmail,
    });
    console.log(userId.id);
    return await this.boardsRepository
      .createQueryBuilder('boards')
      .insert()
      .into(Board, ['title', 'content', 'userId'])
      .values({
        title: createBoardDto.title,
        content: createBoardDto.content,
        userId: userId.id,
      })
      .execute();
  }
}
