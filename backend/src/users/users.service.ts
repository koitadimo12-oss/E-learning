import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Role } from '../common/enums';

/** Service de gestion des utilisateurs en base de données */
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  /** Retire le mot de passe avant d'envoyer l'utilisateur au frontend */
  sanitize(user: User) {
    const { motDePasseHash, ...rest } = user as User & { motDePasseHash?: string };
    return rest;
  }

  /** Met à jour le profil de l'utilisateur connecté */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.users.findOneOrFail({ where: { id: userId } });
    if (dto.modeApprentissage) user.modeApprentissage = dto.modeApprentissage;
    if (dto.niveauEtude) user.niveauEtude = dto.niveauEtude;
    if (dto.parcoursGuideChoisi) user.parcoursGuideChoisi = dto.parcoursGuideChoisi;
    if (dto.onboardingApprentissageTermine !== undefined) {
      user.onboardingApprentissageTermine = dto.onboardingApprentissageTermine;
    }
    if (dto.xp !== undefined) user.xp = dto.xp;
    if (dto.niveau !== undefined) user.niveau = dto.niveau;
    if (dto.streak !== undefined) user.streak = dto.streak;
    if (dto.lastStreakDate !== undefined) user.lastStreakDate = dto.lastStreakDate;
    if (dto.badges !== undefined) user.badges = dto.badges;

    const saved = await this.users.save(user);
    return this.sanitize(saved);
  }

  /** Liste tous les utilisateurs (admin) */
  async list() {
    const all = await this.users.find({ order: { creeLe: 'DESC' } });
    return all.map((u) => this.sanitize(u));
  }

  /** Trouve un utilisateur par id (admin) */
  async findOne(id: string) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    return this.sanitize(user);
  }

  /** Supprime un utilisateur (admin) */
  async remove(id: string, adminId: string) {
    if (id === adminId) {
      throw new BadRequestException('Vous ne pouvez pas supprimer votre propre compte admin.');
    }
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    if (user.role === Role.ADMIN) {
      throw new BadRequestException('Impossible de supprimer un autre administrateur.');
    }
    await this.users.remove(user);
    return { message: 'Utilisateur supprimé.' };
  }
}
