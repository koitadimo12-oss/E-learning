import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  image: string;

  @Column()
  instructeur: string;

  @Column()
  categorie: string;

  @Column()
  niveau: string;

  @Column()
  duree: string;

  @Column({ nullable: true })
  badge: string;

  @Column({ default: false })
  nouveau: boolean;

  @Column({ type: 'json' })
  chapitres: any[];

  @Column({ type: 'json' })
  quiz: any[];
}
