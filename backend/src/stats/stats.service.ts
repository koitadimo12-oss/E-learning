import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Book } from '../books/entities/book.entity';
import { Role } from '../common/enums';

/** Statistiques réelles lues depuis la base de données */
@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Course) private readonly coursesRepo: Repository<Course>,
    @InjectRepository(Book) private readonly booksRepo: Repository<Book>,
  ) {}

  async getGlobalStats() {
    const [coursDisponibles, livresDisponibles, etudiantsActifs] = await Promise.all([
      this.coursesRepo.count(),
      this.booksRepo.count(),
      this.usersRepo.count({ where: { role: Role.STUDENT } }),
    ]);

    return {
      coursDisponibles,
      livresDisponibles,
      etudiantsActifs,
    };
  }
}
