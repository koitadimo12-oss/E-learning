import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role, LearningMode, ContentLanguage } from '../../common/enums';
import { Course } from '../../courses/entities/course.entity';
import { Progress } from '../../progress/entities/progress.entity';
import { Certificate } from '../../certificates/entities/certificate.entity';

@Entity('utilisateurs')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120 })
  nom: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 180 })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  motDePasseHash: string;

  @Column({ type: 'varchar', length: 20, default: Role.STUDENT })
  role: Role;

  @Column({ type: 'varchar', length: 20, default: LearningMode.FREE })
  modeApprentissage: LearningMode;

  @Column({ type: 'varchar', length: 5, default: ContentLanguage.FRENCH })
  languePreferee: ContentLanguage;

  @Column({ type: 'int', default: 0 })
  xp: number;

  @Column({ type: 'int', default: 1 })
  niveau: number;

  // CORRECTION ICI :
  // On retire 'default' du décorateur @Column pour MySQL
  // On initialise la valeur par défaut directement en TypeScript
  @Column({ type: 'simple-json' })
  badges: string[] = [];

  @OneToMany(() => Course, (cours) => cours.auteur)
  coursCrees: Course[];

  @OneToMany(() => Progress, (progression) => progression.utilisateur)
  progressions: Progress[];

  @OneToMany(() => Certificate, (certificat) => certificat.utilisateur)
  certificats: Certificate[];

  @CreateDateColumn()
  creeLe: Date;

  @UpdateDateColumn()
  misAJourLe: Date;
}