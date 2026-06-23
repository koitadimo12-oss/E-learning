import {Column,CreateDateColumn,Entity,Index,OneToMany,PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';
import { Role, LearningMode, NiveauEtude, ParcoursGuide } from '../../common/enums';
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

  @Column({ type: 'varchar', length: 20, nullable: true })
  niveauEtude: NiveauEtude;

  @Column({ type: 'varchar', length: 50, nullable: true })
  parcoursGuideChoisi: ParcoursGuide;

  @Column({ type: 'boolean', default: false })
  onboardingApprentissageTermine: boolean;

  @Column({ type: 'int', default: 0 })
  xp: number;

  @Column({ type: 'int', default: 1 })
  niveau: number;

  @Column({ type: 'int', default: 0 })
  streak: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  lastStreakDate: string;

  // CORRECTION ICI :
  // On retire 'default' du décorateur @Column pour MySQL
  // On initialise la valeur par défaut directement en TypeScript
  @Column({ type: 'simple-json' })
  badges: string[] = [];

  @OneToMany(() => Progress, (progression) => progression.utilisateur)
  progressions: Progress[];

  @OneToMany(() => Certificate, (certificat) => certificat.utilisateur)
  certificats: Certificate[];

  @CreateDateColumn()
  creeLe: Date;

  @UpdateDateColumn()
  misAJourLe: Date;
}