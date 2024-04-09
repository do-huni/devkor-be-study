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
export class Favor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  user: User;

  @RelationId((like: Favor) => like.user)
  @Column()
  userId: string;

  @ManyToOne(() => Board, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  board: Board;

  @RelationId((like: Favor) => like.board)
  @Column()
  boardId: number;
}
