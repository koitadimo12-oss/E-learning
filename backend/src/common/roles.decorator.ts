import { SetMetadata } from '@nestjs/common';
import { Role } from './enums';

export const ROLES_KEY = 'roles';

/**
 * Décorateur RBAC — indique quels rôles peuvent accéder à une route.
 * Exemple : @Roles(Role.ADMIN) sur POST /courses
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

