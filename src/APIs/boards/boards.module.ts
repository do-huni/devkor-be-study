import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { JwtStrategy } from '../auth/strategies/jwt-strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Board]), UsersModule],
  controllers: [BoardsController],
  providers: [BoardsService, JwtStrategy],
  exports: [],
})
export class BoardsModule {}
