import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

// Ce service s'occupe de l'inscription et de la connexion des utilisateurs
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  // Cette méthode permet d'enlever le mot de passe avant de renvoyer l'utilisateur
  sanitizeUser(user: User) {
    const { motDePasseHash, ...leReste } = user as any;
    return leReste;
  }

  // Méthode pour inscrire un nouvel utilisateur
  async register(dto: RegisterDto) {
    const emailFormatte = dto.email.trim().toLowerCase();
    
    // On vérifie si l'email existe déjà
    const utilisateurExistant = await this.users.findOne({ where: { email: emailFormatte } });
    if (utilisateurExistant) {
      throw new BadRequestException('Cet email est déjà utilisé.');
    }

    // On vérifie que le rôle est valide
    const role = dto.role ?? Role.STUDENT;
    if (role !== Role.STUDENT && role !== Role.ADMIN) {
      throw new BadRequestException('Le rôle spécifié est invalide');
    }

    // On hache le mot de passe pour la sécurité
    const hash = await bcrypt.hash(dto.motDePasse, 10);
    
    // On crée l'utilisateur avec TypeORM
    const nouvelUtilisateur = this.users.create({
      nom: dto.nom.trim(),
      email: emailFormatte,
      motDePasseHash: hash,
      role: role,
      niveauEtude: dto.niveauEtude,
    });
    
    // On sauvegarde dans la base de données
    const sauvegarde = await this.users.save(nouvelUtilisateur);
    
    // On génère un token pour qu'il puisse se connecter directement
    const token = await this.jwt.signAsync({ sub: sauvegarde.id, role: sauvegarde.role });
    return { accessToken: token, user: this.sanitizeUser(sauvegarde) };
  }

  // Méthode pour se connecter
  async login(dto: LoginDto) {
    const emailFormatte = dto.email.trim().toLowerCase();
    
    // On cherche l'utilisateur par son email, en demandant de récupérer aussi le mot de passe haché
    const utilisateur = await this.users
      .createQueryBuilder('u')
      .addSelect('u.motDePasseHash')
      .where('u.email = :email', { email: emailFormatte })
      .getOne();
      
    if (!utilisateur) {
      throw new UnauthorizedException('Identifiants invalides.');
    }
    
    // On vérifie si le mot de passe correspond au hash
    const motDePasseCorrect = await bcrypt.compare(dto.motDePasse, utilisateur.motDePasseHash);
    if (!motDePasseCorrect) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    // On génère le token JWT
    const token = await this.jwt.signAsync({ sub: utilisateur.id, role: utilisateur.role });
    return { accessToken: token, user: this.sanitizeUser(utilisateur) };
  }

  /** Réinitialisation du mot de passe (email doit exister en base) */
  async resetPassword(email: string, motDePasse: string) {
    const emailFormatte = email.trim().toLowerCase();
    const utilisateur = await this.users
      .createQueryBuilder('u')
      .addSelect('u.motDePasseHash')
      .where('u.email = :email', { email: emailFormatte })
      .getOne();

    if (!utilisateur) {
      throw new BadRequestException('Aucun compte trouvé avec cet email.');
    }

    utilisateur.motDePasseHash = await bcrypt.hash(motDePasse, 10);
    await this.users.save(utilisateur);
    return { message: 'Mot de passe mis à jour. Vous pouvez vous connecter.' };
  }
}
