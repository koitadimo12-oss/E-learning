import { IsEnum, IsOptional } from 'class-validator';
import { LearningMode, NiveauEtude, ParcoursGuide } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ enum: LearningMode })
  @IsOptional()
  @IsEnum(LearningMode)
  modeApprentissage?: LearningMode;

  @ApiProperty({ enum: NiveauEtude })
  @IsOptional()
  @IsEnum(NiveauEtude)
  niveauEtude?: NiveauEtude;

  @ApiProperty({ enum: ParcoursGuide })
  @IsOptional()
  @IsEnum(ParcoursGuide)
  parcoursGuideChoisi?: ParcoursGuide;

  @IsOptional()
  onboardingApprentissageTermine?: boolean;
}
