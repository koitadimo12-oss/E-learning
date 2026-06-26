import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async onModuleInit() {
    // Le try/catch est crucial pour empêcher l'arrêt du serveur si la BDD n'est pas prête
    try {
      this.logger.log('Démarrage du processus de Seed...');
      await this.seedAdmin();
      await this.seedCourses();
      await this.seedBooks();
      this.logger.log('Processus de Seed terminé avec succès.');
    } catch (error) {
      this.logger.warn('Seed ignoré : la base de données est probablement en cours de synchronisation.');
    }
  }

  private async seedAdmin() {
    // Utilisation de config.get pour éviter le plantage si les variables sont absentes
    const email = this.config.get<string>('ADMIN_SEED_EMAIL')?.trim().toLowerCase();
    const motDePasse = this.config.get<string>('ADMIN_SEED_PASSWORD');

    if (!email || !motDePasse) {
      this.logger.warn('Seed Admin ignoré : variables ADMIN_SEED_EMAIL/PASSWORD manquantes.');
      return;
    }

    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      this.logger.log('Compte admin déjà présent. Seed ignoré.');
      return;
    }

    const hash = await bcrypt.hash(motDePasse, 10);
    const admin = this.usersRepository.create({
      nom: 'Administrateur',
      email,
      motDePasseHash: hash,
      role: Role.ADMIN,
    });
    await this.usersRepository.save(admin);
    this.logger.log('Compte admin initial créé.');
  }

  private async seedCourses() {
    const CIBLE = 115;
    const count = await this.coursesRepository.count();
    if (count >= CIBLE) return;

    // Logique d'ajout des cours
    for (const cours of listeCours) {
      const existing = await this.coursesRepository.findOne({ where: { titre: cours.titre } });
      if (!existing) {
        await this.coursesRepository.save(this.coursesRepository.create(cours));
      }
    }
    this.logger.log(`Courses initialisés.`);
  }

  private async seedBooks() {
    const CIBLE = 115;
    const count = await this.booksRepository.count();
    if (count >= CIBLE) return;

    // Logique d'ajout des livres
    for (const livre of getLivresPourSeed(CIBLE)) {
      const existing = await this.booksRepository.findOne({ where: { title: livre.title } });
      if (!existing) {
        await this.booksRepository.save(this.booksRepository.create(livre));
      }
    }
    this.logger.log(`Books initialisés.`);
  }
}