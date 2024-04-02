import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Board } from 'src/APIs/boards/entities/board.entity';
import { User } from 'src/APIs/users/entities/user.entity';

@Entity('like')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @RelationId((like: Like) => like.user)
  @Column()
  userId: string;

  @ManyToOne(() => Board)
  board: Board;

  @RelationId((like: Like) => like.board)
  @Column()
  boardId: number;
}
