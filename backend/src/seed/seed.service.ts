import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums';
import { listeCours } from './data';
import { getLivresPourSeed } from './books-data';
import { Book } from '../books/entities/book.entity';
import { envRequired } from '../config/env.config';

/**
 * Données initiales au démarrage du serveur.
 * Crée le compte admin et les cours de démo si la BDD est vide.
 */
@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
    await this.seedCourses();
    await this.seedBooks();
  }

  /** Compte admin initial — identifiants uniquement dans backend/.env */
  private async seedAdmin() {
    const email = envRequired(this.config, 'ADMIN_SEED_EMAIL').trim().toLowerCase();
    const motDePasse = envRequired(this.config, 'ADMIN_SEED_PASSWORD');

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
    this.logger.log('Compte admin initial créé (voir ADMIN_SEED_EMAIL dans .env).');
  }

  private async seedCourses() {
    const CIBLE = 115;
    const count = await this.coursesRepository.count();
    if (count >= CIBLE) {
      this.logger.log(`Courses: ${count} en base (objectif ${CIBLE} atteint).`);
      return;
    }

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
    this.logger.log(`Courses: +${ajoutes} ajoutés (total ~${count + ajoutes}).`);
  }

  /** Complète la bibliothèque jusqu'à 115 livres */
  private async seedBooks() {
    const CIBLE = 115;
    const count = await this.booksRepository.count();
    if (count >= CIBLE) {
      this.logger.log(`Books: ${count} en base (objectif ${CIBLE} atteint).`);
      return;
    }

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
    this.logger.log(`Books: +${ajoutes} ajoutés (total ~${count + ajoutes}).`);
  }
}
