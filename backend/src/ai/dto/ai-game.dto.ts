import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class AiGameDto {
  @IsOptional()
  @IsString()
  lang?: string; // fr|en|wo|ar

  @IsOptional()
  @IsString()
  topic: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  lastScore: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  level?: number;
}

