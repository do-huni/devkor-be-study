import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Favor } from './entities/favor.entity';
import { FetchFavorsDto } from './dtos/fetch-favors.dto';
import { Board } from '../boards/entities/board.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class FavorsService {
  constructor(
    @InjectRepository(Favor)
    private readonly favorsRepository: Repository<Favor>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async toggleFavor({ id, email }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 서비스 안 걸치고 직접 접근(순환 참조 경계)
      // 대안은 없을까?
      const boardData = await queryRunner.manager.findOne(Board, {
        where: { id },
      });
      if (!boardData)
        throw new NotFoundException('게시글이 존재하지 않습니다.');
      const userData = await this.usersService.findUserByEmailWithToken({
        email,
      });
      // 좋아요 눌렀는지 확인하기
      const alreadyFavored = await this.favorsRepository.findOne({
        where: { board: { id } },
      });
      if (alreadyFavored) {
        await queryRunner.manager.delete(Favor, { id: alreadyFavored.id });
        await queryRunner.manager.update(Board, boardData.id, {
          likeCount: () => 'likeCount -1',
        });
        boardData.likeCount -= 1;
      } else {
        await queryRunner.manager.save(Favor, {
          user: userData,
          board: boardData,
        });
        await queryRunner.manager.update(Board, boardData.id, {
          likeCount: () => 'likeCount +1',
        });
        boardData.likeCount += 1;
      }
      await queryRunner.commitTransaction();
      return boardData;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async fetchFavors({ id }: FetchFavorsDto): Promise<Favor[]> {
    return await this.favorsRepository.find({
      select: { user: { username: true, email: true }, id: true },
      relations: { user: true },
      where: { board: { id } },
    });
  }
}
