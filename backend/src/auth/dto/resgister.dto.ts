import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';

// DTO (Data Transfer Object) pour l'inscription d'un nouvel utilisateur
export class RegisterDto {
  @ApiProperty({ example: 'Jean Dupont' })
  @IsNotEmpty()
  @IsString()
  nom: string;

  @ApiProperty({ example: 'jean@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'motdepassesecret' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' })
  motDePasse: string;

  @ApiProperty({ enum: Role, default: Role.STUDENT })
  @IsNotEmpty()
  role: Role;
}
