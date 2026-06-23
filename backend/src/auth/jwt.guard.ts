import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Garde JWT — bloque l'accès si le token est absent ou invalide.
 * Utilisation : @UseGuards(JwtAuthGuard) sur une route protégée.
 * Le frontend envoie le token dans l'en-tête : Authorization: Bearer <token>
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

