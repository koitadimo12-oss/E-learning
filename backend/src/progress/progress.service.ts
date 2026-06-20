import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';
import { Course } from '../courses/entities/course.entity';
import { CourseModule } from '../courses/entities/course-module.entity';
import { Quiz } from '../courses/entities/quiz.entity';
import { User } from '../users/entities/user.entity';
import { LearningMode } from '../common/enums';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress) private readonly progress: Repository<Progress>,
    @InjectRepository(Course) private readonly courses: Repository<Course>,
    @InjectRepository(CourseModule) private readonly modules: Repository<CourseModule>,
    @InjectRepository(Quiz) private readonly quizzes: Repository<Quiz>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async getOrCreate(user: User, courseId: string) {
    const course = await this.courses.findOne({ where: { id: courseId }, relations: { modules: true } });
    if (!course) throw new NotFoundException('Cours introuvable.');
    let p = await this.progress.findOne({ where: { utilisateur: { id: user.id }, cours: { id: courseId } } });
    if (!p) {
      p = await this.progress.save(
        this.progress.create({
          utilisateur: user,
          cours: course,
          moduleActuel: null,
          pourcentage: 0,
          scoreModules: {},
          modulesValides: [],
        }),
      );
    }
    return p;
  }

  async getMine(user: User, courseId: string) {
    return this.getOrCreate(user, courseId);
  }

  async submitQuiz(user: User, dto: SubmitQuizDto) {
    const p = await this.getOrCreate(user, dto.courseId);
    const quiz = await this.quizzes.findOne({
      where: { id: dto.quizId },
      relations: { questions: true, moduleCours: true },
    });
    if (!quiz) throw new NotFoundException('Quiz introuvable.');
    if (quiz.moduleCours.id !== dto.moduleId) throw new BadRequestException('Quiz/module mismatch.');

    const total = quiz.questions.length;
    if (total === 0) throw new BadRequestException('Quiz vide.');
    if (dto.answers.length !== total) throw new BadRequestException('Nombre de réponses invalide.');

    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (dto.answers[idx] === q.indexBonneReponse) correct += 1;
    });
    const score = Math.round((correct / total) * 100);

    p.scoreModules = { ...(p.scoreModules ?? {}), [dto.moduleId]: score };
    if (score >= 50 && !p.modulesValides.includes(dto.moduleId)) {
      p.modulesValides = [...p.modulesValides, dto.moduleId];
      user.xp += 50;
      if (user.xp >= user.niveau * 200) user.niveau += 1;
      await this.users.save(user);
    }

    const course = await this.courses.findOne({
      where: { id: dto.courseId },
      relations: { modules: true },
      order: { modules: { ordre: 'ASC' } },
    });
    if (!course) throw new NotFoundException('Cours introuvable.');

    const totalModules = course.modules.length || 1;
    p.pourcentage = Math.min(100, Math.round((p.modulesValides.length / totalModules) * 100));

    if (user.modeApprentissage === LearningMode.GUIDED) {
      const ordered = [...course.modules].sort((a, b) => a.ordre - b.ordre);
      const currentIndex = ordered.findIndex((m) => m.id === dto.moduleId);
      const next = currentIndex >= 0 ? ordered[currentIndex + 1] : undefined;
      p.moduleActuel = next ?? null;
    }

    await this.progress.save(p);
    return { score, validated: score >= 50, progress: p };
  }
}
