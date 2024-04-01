import { Column, Entity } from 'typeorm';

@Entity()
export class EmailCode {
  @Column({ primary: true })
  email: string;

  @Column()
  uuid: string;
}
