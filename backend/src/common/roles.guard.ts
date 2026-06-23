import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './enums';
import { User } from '../users/entities/user.entity';

/**
 * Garde RBAC — vérifie le rôle de l'utilisateur connecté.
 * Fonctionne avec @Roles(Role.ADMIN) et doit être utilisé APRÈS JwtAuthGuard.
 *
 * Flux : requête → JwtAuthGuard (vérifie le token) → RolesGuard (vérifie le rôle)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lit les rôles autorisés définis par @Roles() sur la route
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // Pas de @Roles() → route accessible à tout utilisateur connecté
    if (!roles || roles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as User | undefined;
    if (!user) return false;
    // Vérifie que le rôle de l'utilisateur est dans la liste autorisée
    return roles.includes(user.role);
  }
}

