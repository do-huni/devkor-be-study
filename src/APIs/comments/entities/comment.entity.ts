import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Board } from 'src/APIs/boards/entities/board.entity';
import { User } from 'src/APIs/users/entities/user.entity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Board)
  board: Board;

  @RelationId((comment: Comment) => comment.board)
  @Column()
  boardId: number;

  @ManyToOne(() => User)
  user: User;

  @RelationId((comment: Comment) => comment.user)
  @Column()
  userId: string;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Comment, (comment) => comment.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Comment;

  @RelationId((comment: Comment) => comment.parent)
  @Column({ nullable: true })
  parentId: number;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];
}
