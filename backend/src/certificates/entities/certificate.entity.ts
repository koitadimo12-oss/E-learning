// Cette entité stocke les certificats de réussite des étudiants.
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('certificats')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // L'utilisateur qui a gagné le certificat
  @ManyToOne(() => User, (utilisateur) => utilisateur.certificats, { onDelete: 'CASCADE', eager: true })
  utilisateur: User;

  // Le cours pour lequel le certificat a été délivré
  @ManyToOne(() => Course, { onDelete: 'CASCADE', eager: true })
  cours: Course;

  // La date d'obtention
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateDelivrance: Date;

  // Le lien vers le document PDF du certificat
  @Column({ type: 'varchar', length: 255, nullable: true })
  urlPdf: string | null;

  @CreateDateColumn()
  creeLe: Date;
}
