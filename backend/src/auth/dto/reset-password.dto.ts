import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'etudiant@email.com' })
  @IsEmail({}, { message: 'Email invalide.' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'NouveauMotDePasse1!' })
  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' })
  motDePasse: string;
}
