import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { envRequired } from '../config/env.config';

type JwtPayload = { sub: string; role: string };

/**
 * Stratégie Passport JWT — décode le token envoyé par le frontend.
 *
 * 1. Le frontend envoie : Authorization: Bearer eyJhbG...
 * 2. Cette stratégie vérifie la signature avec JWT_ACCESS_SECRET (.env)
 * 3. validate() charge l'utilisateur en BDD et le place dans request.user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envRequired(config, 'JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // payload.sub = id utilisateur encodé dans le token à la connexion
    return this.users.findOneOrFail({ where: { id: payload.sub } });
  }
}

