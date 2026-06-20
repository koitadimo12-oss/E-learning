import { IsEnum, IsNotEmpty } from 'class-validator';
import { ContentLanguage, LearningMode } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

// DTO pour mettre à jour le profil
export class UpdateProfileDto {
  @ApiProperty({ enum: ContentLanguage })
  @IsNotEmpty()
  @IsEnum(ContentLanguage)
  languePreferee!: ContentLanguage;

  @ApiProperty({ enum: LearningMode })
  @IsNotEmpty()
  @IsEnum(LearningMode)
  modeApprentissage!: LearningMode;
}
