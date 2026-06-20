import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Progress } from './entities/progress.entity';
import { Course } from '../courses/entities/course.entity';
import { CourseModule } from '../courses/entities/course-module.entity';
import { Quiz } from '../courses/entities/quiz.entity';
import { User } from '../users/entities/user.entity';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  imports: [TypeOrmModule.forFeature([Progress, Course, CourseModule, Quiz, User])],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}

