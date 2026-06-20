import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class AiQuizDto {
  @IsOptional()
  @IsString()
  lang?: string; // fr|en|wo|ar

  @IsOptional()
  @IsString()
  topic: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  count: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  difficulty: number; // 1 easy, 2 medium, 3 hard
}

