import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { CourseModule } from '../../courses/entities/course-module.entity';
import { Lesson } from '../../courses/entities/lesson.entity';
import { Quiz } from '../../courses/entities/quiz.entity';

/**
 * Entité représentant la progression d'un utilisateur dans un cours spécifique.
 * Utilise @Unique pour garantir qu'un utilisateur ne possède qu'une seule fiche de progression par cours.
 */
@Entity('progressions')
@Unique(['utilisateur', 'cours'])
export class Progress {
  // L'identifiant unique généré automatiquement (UUID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // L'étudiant propriétaire de cette progression
  @ManyToOne(() => User, (utilisateur) => utilisateur.progressions, { onDelete: 'CASCADE' })
  utilisateur: User;

  // Le cours associé à cette progression
  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  cours: Course;

  // Le module actuellement sélectionné (peut être nul lors d'une progression globale)
  @ManyToOne(() => CourseModule, { onDelete: 'CASCADE', nullable: true })
  moduleCours: CourseModule | null;

  // Le module cible en mode de navigation guidée
  @ManyToOne(() => CourseModule, { nullable: true })
  moduleActuel: CourseModule | null;

  // La dernière leçon consultée par l'étudiant
  @ManyToOne(() => Lesson, { onDelete: 'CASCADE', nullable: true })
  lecon: Lesson | null;

  // Le dernier quiz effectué
  @ManyToOne(() => Quiz, { onDelete: 'CASCADE', nullable: true })
  quiz: Quiz | null;

  // Score obtenu au dernier quiz passé
  @Column({ type: 'int', nullable: true })
  score: number | null;

  // Stockage des scores par module : { "moduleId": score }
  // Initialisé à {} côté application car MySQL ne supporte pas le DEFAULT sur les colonnes TEXT
  @Column({ type: 'simple-json' })
  scoreModules: Record<string, number> = {};

  // Liste des IDs des modules validés par l'utilisateur
  // Initialisé à [] pour éviter les erreurs de type nul
  @Column({ type: 'simple-json' })
  modulesValides: string[] = [];

  // Pourcentage de progression global dans le cours (0 à 100)
  @Column({ type: 'int', default: 0 })
  pourcentage: number;

  // Flag indiquant si le cours a été intégralement complété
  @Column({ type: 'boolean', default: false })
  estTermine: boolean;

  // Date de fin du cours (si terminé)
  @Column({ type: 'timestamp', nullable: true })
  termineLe: Date | null;

  // Date de création de la ligne de progression
  @CreateDateColumn()
  creeLe: Date;

  // Date de la dernière modification de la progression
  @UpdateDateColumn()
  misAJourLe: Date;
}