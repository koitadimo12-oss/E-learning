import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class AiAdviceDto {
  @IsOptional()
  @IsString()
  userId: string; // allowed for visitor too (optional)

  @IsOptional()
  @IsString()
  lang?: string; // fr | en | wo | ar

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  lastScore: number;

  @IsOptional()
  @IsString()
  topic: string;
}

