import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { JwtStrategy } from '../auth/strategies/jwt-strategy';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Board]), UsersModule, CommentsModule],
  controllers: [BoardsController],
  providers: [BoardsService, JwtStrategy],
  exports: [],
})
export class BoardsModule {}
