import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Board } from '../boards/entities/board.entity';
import { Favor } from './entities/favor.entity';
import { FavorsService } from './favors.service';
import { FavorsController } from './favors.controller';
import { JwtStrategy } from '../auth/strategies/jwt-strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Favor]), UsersModule],
  providers: [JwtStrategy, FavorsService],
  controllers: [FavorsController],
})
export class FavorsModule {}
