// import {
//   Column,
//   Entity,
//   ManyToOne,
//   OneToMany,
//   PrimaryGeneratedColumn,
//   RelationId,
// } from 'typeorm';
// import { User } from './user.entity';
// import { Comment } from './comment.entity';
// import { Reply } from './reply.entity';
// import { Like } from './like.entity';
// import { View } from './view.entity';

// @Entity()
// export class Post extends BasicDate {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   title: string;

//   @Column()
//   content: string;

//   @ManyToOne((type) => User, (user) => user.posts)
//   user: User;

//   @RelationId((post: Post) => post.user)
//   @Column() //fk
//   userUuid: string;

//   @OneToMany((type) => Comment, (comment) => comment.post)
//   comments: Comment[];

//   @OneToMany((type) => Reply, (reply) => reply.post)
//   replies: Reply[];

//   @OneToMany((type) => Like, (like) => like.post)
//   likes: Like[];

//   @OneToMany((type) => View, (view) => view.post)
//   views: View[];

//   // @Column({ default: 0 }) //필요한가?
//   // likeCount: number;

//   // @Column({ default: 0 }) //필요한가? 2 일단 유지
//   // viewCount: number;
// }
