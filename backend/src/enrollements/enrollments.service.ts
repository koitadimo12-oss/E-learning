import { Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentsService {

  create(createEnrollmentDto: CreateEnrollmentDto) {
    return {
      message: 'Inscription créée avec succès',
      data: createEnrollmentDto,
    };
  }

  findAll() {
    return 'Liste des inscriptions';
  }

  findOne(id: number) {
    return `Inscription numéro ${id}`;
  }

  update(id: number) {
    return `Inscription ${id} mise à jour`;
  }

  remove(id: number) {
    return `Inscription ${id} supprimée`;
  }
}