import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly usersService: UsersService,
  ) {}

  async upsertValidCheck({ id }) {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('아이디를 찾을 수 없습니다.');
    }
  }
  async upsert(createCommentDto: CreateCommentDto) {
    const userId = (
      await this.usersService.findUserByEmail({ email: createCommentDto.email })
    ).id;
    const { email, ...rest } = createCommentDto;
    const obj = { ...rest, userId };
    // id를 insert에 사용시 임의로 설정할 수 있는 문제 있음. 유효성 체크
    if (obj.id) {
      await this.upsertValidCheck({ id: obj.id });
    }
    return await this.commentsRepository
      .createQueryBuilder('c')
      .insert()
      .into(Comment, Object.keys(obj))
      .values(obj)
      .orUpdate(Object.keys(obj), ['id'])
      .execute();
  }

  async fetchComments({ boardId }) {
    return await this.commentsRepository
      .createQueryBuilder('c')
      .innerJoin('c.user', 'u')
      .addSelect(['u.username', 'u.email'])
      .where('c.boardId = :boardId', { boardId })
      .orderBy('c.created_at', 'ASC')
      .getManyAndCount();
  }
}
