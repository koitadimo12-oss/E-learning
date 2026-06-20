import { IsOptional, IsString } from 'class-validator';

export class AiLessonDto {
  @IsOptional()
  @IsString()
  lang?: string; // fr|en|wo|ar

  @IsOptional()
  @IsString()
  courseTitle: string;

  @IsOptional()
  @IsString()
  lessonTitle: string;

  @IsOptional()
  @IsString()
  youtubeUrl: string;
}

