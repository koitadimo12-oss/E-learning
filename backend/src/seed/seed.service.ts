import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';
import { Book } from '../books/entities/book.entity';
import { Role } from '../common/enums';
import { listeCours } from './data';
import { getLivresPourSeed } from './books-data';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Course) private readonly coursesRepository: Repository<Course>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Book) private readonly booksRepository: Repository<Book>,
    private readonly config: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    // ÉTAPE 1 : Vérification de la connexion
    if (!(await this.isDbReady())) {
      this.logger.error('Base de données inaccessible au démarrage.');
      return; // On ne lance pas le seed si la BDD est down
    }

    // ÉTAPE 2 : Tentative de seed avec sécurité
    try {
      this.logger.log('Lancement du Seed...');
      await this.seedAdmin();
      await this.seedCourses();
      await this.seedBooks();
      this.logger.log('Seed terminé avec succès.');
    } catch (error) {
     this.logger.error('Erreur lors du Seed : ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  private async isDbReady(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (e) {
      return false;
    }
  }

  private async seedAdmin() {
    const email = this.config.get<string>('ADMIN_SEED_EMAIL')?.trim().toLowerCase();
    const motDePasse = this.config.get<string>('ADMIN_SEED_PASSWORD');
    if (!email || !motDePasse) return;

    try {
      const existing = await this.usersRepository.findOne({ where: { email } });
      if (existing) return;

      const hash = await bcrypt.hash(motDePasse, 10);
      const admin = this.usersRepository.create({
        nom: 'Administrateur',
        email,
        motDePasseHash: hash,
        role: Role.ADMIN,
      });
      await this.usersRepository.save(admin);
    } catch (e) {
      this.logger.warn('Table utilisateurs non disponible pour le Seed Admin.');
    }
  }

  private async seedCourses() {
    const CIBLE = 115;
    try {
      const count = await this.coursesRepository.count();
      if (count >= CIBLE) return;
      for (const cours of listeCours) {
        const existing = await this.coursesRepository.findOne({ where: { titre: cours.titre } });
        if (!existing) await this.coursesRepository.save(this.coursesRepository.create(cours));
      }
    } catch (e) {
      this.logger.warn('Table courses non disponible pour le Seed.');
    }
  }

  private async seedBooks() {
    const CIBLE = 115;
    try {
      const count = await this.booksRepository.count();
      if (count >= CIBLE) return;
      for (const livre of getLivresPourSeed(CIBLE)) {
        const existing = await this.booksRepository.findOne({ where: { title: livre.title } });
        if (!existing) await this.booksRepository.save(this.booksRepository.create(livre));
      }
    } catch (e) {
      this.logger.warn('Table books non disponible pour le Seed.');
    }
  }
}