import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Role } from '../common/enums';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  sanitize(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { motDePasseHash, ...rest } = user as any;
    return rest;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.users.findOneOrFail({ where: { id: userId } });
    if (dto.languePreferee) user.languePreferee = dto.languePreferee;
    if (dto.modeApprentissage) user.modeApprentissage = dto.modeApprentissage;
    const saved = await this.users.save(user);
    return this.sanitize(saved);
  }

  async list() {
    const all = await this.users.find({ order: { creeLe: 'DESC' } });
    return all.map((u) => this.sanitize(u));
  }


}
