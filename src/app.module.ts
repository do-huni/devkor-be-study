import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './APIs/auth/auth.module';
import { UsersModule } from './APIs/users/users.module';
import { MailsModule } from './APIs/mails/mails.module';
import { BoardsModule } from './APIs/boards/boards.module';
import { FavorsModule } from './APIs/\bfavors/favors.module';
import { CommentsModule } from './APIs/comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailsModule,
    FavorsModule,
    BoardsModule,
    CommentsModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/APIs/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
