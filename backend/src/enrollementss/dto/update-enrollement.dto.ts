import { PartialType } from '@nestjs/mapped-types';
import { CreateEnrollmentDto } from './create-enrollement.dto';

export class UpdateEnrollmentDto extends PartialType(
  CreateEnrollmentDto,
) {}