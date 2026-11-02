
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  // Créer un cours
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    return await this.courseRepository.save(course);
  }

  // Récupérer tous les cours
  async findAll(): Promise<Course[]> {
    return await this.courseRepository.find();
  }

  // Récupérer un cours par son identifiant
  async findOne(id: number): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id });

    if (!course) {
      throw new NotFoundException(`Le cours avec l'id ${id} n'existe pas.`);
    }

    return course;
  }

  // Modifier un cours
  async update(
    id: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const course = await this.findOne(id);
    Object.assign(course, updateCourseDto);

    return await this.courseRepository.save(course);
  }

  // Supprimer un cours
  async remove(id: number): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepository.remove(course);
  }

  // Vérifier les chemins des images enregistrés dans Aiven
  async verifierImages(): Promise<
    Pick<Course, 'id' | 'titre' | 'image'>[]
  > {
    return await this.courseRepository
      .createQueryBuilder('course')
      .select(['course.id', 'course.titre', 'course.image'])
      .getMany();
  }
}

