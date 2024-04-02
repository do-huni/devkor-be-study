import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { CreateBoardsDto } from './dtos/create-boards.dto';
import { UsersService } from '../users/users.service';
import { FetchPostsDto } from './dtos/fetch-posts.dto';
import { Page } from 'src/utils/page/page';

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
  async fetchBoards(page: FetchPostsDto) {
    if (!page.search) {
    }
    const boardsAndCounts = await this.boardsRepository
      .createQueryBuilder('b')
      .innerJoin('b.user', 'user')
      .addSelect(['user.email', 'user.username'])
      .orderBy(`b.${page.filter}`, 'DESC')
      .where('b.title LIKE :search', { search: `%${page.search}%` })
      .take(page.getLimit())
      .skip(page.getOffset())
      .getManyAndCount();

    return new Page<Board>(
      boardsAndCounts[1],
      page.pageSize,
      boardsAndCounts[0],
    );
  }

  async fetchBoard({ id }) {
    return await this.boardsRepository
      .createQueryBuilder('b')
      .innerJoin('b.user', 'user')
      .addSelect(['user.email', 'user.username'])
      .where('b.id = :id', { id })
      .getOne();
  }
}
