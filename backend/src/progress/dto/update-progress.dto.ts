import { IsArray, IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateProgressDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  pourcentage?: number;

  @IsOptional()
  @IsArray()
  leconsValidees?: string[];

  @IsOptional()
  @IsBoolean()
  estTermine?: boolean;

  @IsOptional()
  @IsInt()
  scoreQuiz?: number;
}
