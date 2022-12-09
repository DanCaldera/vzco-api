import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Waitlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  signInEnabled: boolean;

  @Column('timestamp', {
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
