import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO pour la connexion de l'utilisateur
export class LoginDto {
  @ApiProperty({ example: 'jean@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'motdepassesecret' })
  @IsNotEmpty()
  @IsString()
  motDePasse!: string;
}
