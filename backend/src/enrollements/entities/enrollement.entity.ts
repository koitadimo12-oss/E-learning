import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Enrollment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  courseId: number;

  @Column()
  amount: number;

  @Column()
  paid: boolean;

  @CreateDateColumn()
  enrolledAt: Date;
}