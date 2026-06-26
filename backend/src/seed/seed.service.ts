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
    // Le try/catch est crucial ici pour empêcher le crash au premier déploiement
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
    // Utilisation de config.get pour éviter le crash si les variables manquent
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

    const titresExistants = new Set(
      (await this.coursesRepository.find({ select: { titre: true } })).map((c) => c.titre),
    );

    let ajoutes = 0;
    for (const cours of listeCours) {
      if (count + ajoutes >= CIBLE) break;
      if (titresExistants.has(cours.titre)) continue;

      const newCourse = this.coursesRepository.create({
        titre: cours.titre,
        description: cours.description,
        image: cours.image,
        instructeur: cours.instructeur,
        categorie: cours.categorie,
        niveau: cours.niveau,
        duree: cours.duree,
        badge: cours.badge,
        nouveau: cours.nouveau,
        chapitres: cours.chapitres,
        quiz: cours.quiz,
      });
      await this.coursesRepository.save(newCourse);
      titresExistants.add(cours.titre);
      ajoutes++;
    }
    this.logger.log(`Courses: +${ajoutes} ajoutés.`);
  }

  private async seedBooks() {
    const CIBLE = 115;
    const count = await this.booksRepository.count();
    if (count >= CIBLE) return;

    const titresExistants = new Set(
      (await this.booksRepository.find({ select: { title: true } })).map((b) => b.title),
    );

    let ajoutes = 0;
    for (const livre of getLivresPourSeed(CIBLE)) {
      if (count + ajoutes >= CIBLE) break;
      if (titresExistants.has(livre.title)) continue;

      const row = this.booksRepository.create(livre);
      await this.booksRepository.save(row);
      titresExistants.add(livre.title);
      ajoutes++;
    }
    this.logger.log(`Books: +${ajoutes} ajoutés.`);
  }
}