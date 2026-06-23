import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LearningMode, NiveauEtude, ParcoursGuide } from '../../common/enums';

export class UpdateProfileDto {
  @ApiProperty({ enum: LearningMode, required: false })
  @IsOptional()
  @IsEnum(LearningMode)
  modeApprentissage?: LearningMode;

  @ApiProperty({ enum: NiveauEtude, required: false })
  @IsOptional()
  @IsEnum(NiveauEtude)
  niveauEtude?: NiveauEtude;

  @ApiProperty({ enum: ParcoursGuide, required: false })
  @IsOptional()
  @IsEnum(ParcoursGuide)
  parcoursGuideChoisi?: ParcoursGuide;

  @IsOptional()
  onboardingApprentissageTermine?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  xp?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  niveau?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  streak?: number;

  @IsOptional()
  @IsString()
  lastStreakDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  badges?: string[];
}
