import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  instructeur: string;

  @IsString()
  @IsNotEmpty()
  categorie: string;

  @IsString()
  @IsNotEmpty()
  niveau: string;

  @IsString()
  @IsNotEmpty()
  duree: string;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsBoolean()
  @IsOptional()
  nouveau?: boolean;

  @IsArray()
  @IsOptional()
  chapitres?: any[];

  @IsArray()
  @IsOptional()
  quiz?: any[];
}
