import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/** Données envoyées pour discuter avec l'IA Mistral */
export class AiChatDto {
  @ApiProperty({ example: 'Explique-moi les boucles en JavaScript' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ required: false, example: 'Cours JavaScript chapitre 2' })
  @IsOptional()
  @IsString()
  context?: string;

  @ApiProperty({ required: false, example: 'fr' })
  @IsOptional()
  @IsString()
  lang?: string;
}
