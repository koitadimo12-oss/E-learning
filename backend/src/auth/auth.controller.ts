import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

// Ce contrôleur gère toutes les routes commençant par /auth
@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // Route pour s'inscrire (POST /auth/register)
  @ApiOperation({ summary: 'Créer un nouveau compte utilisateur' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  // Route pour se connecter (POST /auth/login)
  @ApiOperation({ summary: 'Se connecter à son compte' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  // Route pour récupérer son propre profil (GET /auth/me)
  // Nécessite d'être connecté (JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() utilisateur: User) {
    return this.auth.sanitizeUser(utilisateur);
  }
}
