import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { Course } from '../courses/entities/course.entity';
import { Progress } from '../progress/entities/progress.entity';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, Course, Progress])],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}

