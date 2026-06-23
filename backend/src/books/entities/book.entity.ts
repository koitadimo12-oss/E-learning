import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  description: string;

  @Column()
  pdfUrl: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  coverUrl: string;
}