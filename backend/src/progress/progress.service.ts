import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress) private readonly progress: Repository<Progress>,
    @InjectRepository(Course) private readonly courses: Repository<Course>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  private async findCourse(courseId: string) {
    const id = Number(courseId);
    if (Number.isNaN(id)) throw new NotFoundException('Cours introuvable.');
    const course = await this.courses.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Cours introuvable.');
    return course;
  }

  async getOrCreate(user: User, courseId: string) {
    const course = await this.findCourse(courseId);
    let p = await this.progress.findOne({
      where: { utilisateur: { id: user.id }, cours: { id: course.id } },
      relations: { cours: true },
    });
    if (!p) {
      p = await this.progress.save(
        this.progress.create({
          utilisateur: user,
          cours: course,
          pourcentage: 0,
          scoreModules: {},
          modulesValides: [],
          leconsValidees: [],
        }),
      );
      p = await this.progress.findOne({
        where: { id: p.id },
        relations: { cours: true },
      });
    }
    return p!;
  }

  async listForUser(user: User) {
    return this.progress.find({
      where: { utilisateur: { id: user.id } },
      relations: { cours: true },
      order: { misAJourLe: 'DESC' },
    });
  }

  async getMine(user: User, courseId: string) {
    return this.getOrCreate(user, courseId);
  }

  async updateProgress(user: User, courseId: string, dto: UpdateProgressDto) {
    const p = await this.getOrCreate(user, courseId);
    if (dto.pourcentage !== undefined) p.pourcentage = dto.pourcentage;
    if (dto.leconsValidees !== undefined) p.leconsValidees = dto.leconsValidees;
    if (dto.estTermine !== undefined) {
      p.estTermine = dto.estTermine;
      p.termineLe = dto.estTermine ? new Date() : null;
    }
    if (dto.scoreQuiz !== undefined) p.scoreQuiz = dto.scoreQuiz;
    return this.progress.save(p);
  }

  async submitQuiz(user: User, dto: SubmitQuizDto) {
    const total = dto.answers.length;
    if (total === 0) throw new NotFoundException('Quiz vide.');
    const correct = dto.answers.filter((a, i) => a === i).length;
    const score = Math.round((correct / total) * 100);
    const validated = score >= 50;

    if (validated) {
      user.xp += 25;
      if (user.xp >= user.niveau * 100) user.niveau += 1;
      await this.users.save(user);
    }

    return this.updateProgress(user, dto.courseId, {
      pourcentage: validated ? 100 : score,
      scoreQuiz: score,
      estTermine: validated,
    });
  }
}
