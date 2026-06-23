import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './entities/certificate.entity';
import { Course } from '../courses/entities/course.entity';
import { Progress } from '../progress/entities/progress.entity';
import { User } from '../users/entities/user.entity';
import { LearningMode } from '../common/enums';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate) private readonly certs: Repository<Certificate>,
    @InjectRepository(Course) private readonly courses: Repository<Course>,
    @InjectRepository(Progress) private readonly progress: Repository<Progress>,
  ) {}

  async myCertificates(user: User) {
    return this.certs.find({ where: { utilisateur: { id: user.id } }, order: { dateDelivrance: 'DESC' } });
  }

  async issueForCourse(user: User, courseId: string, body: { projectUrl?: string; projectNote?: string }) {
    const id = Number(courseId);
    if (!Number.isFinite(id)) throw new BadRequestException('Identifiant de cours invalide.');

    if (user.modeApprentissage !== LearningMode.GUIDED) {
      throw new BadRequestException("Certificat disponible uniquement en parcours guidé.");
    }

    const course = await this.courses.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Cours introuvable.');

    const prog = await this.progress.findOne({ where: { utilisateur: { id: user.id }, cours: { id } } });
    if (!prog || prog.pourcentage < 100) {
      throw new BadRequestException('Terminez tous les modules du cours avant le certificat.');
    }

    const existing = await this.certs.findOne({ where: { utilisateur: { id: user.id }, cours: { id } } });
    if (existing) return existing;

    const cert = this.certs.create({
      utilisateur: user,
      cours: course,
    });
    const saved = await this.certs.save(cert);
    return {
      ...saved,
      meta: {
        projectUrl: body.projectUrl ?? null,
        projectNote: body.projectNote ?? null,
      },
    };
  }
}
