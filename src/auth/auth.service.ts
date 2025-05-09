import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/usersProfiles/users/entities/user.entity';
import { ProfilePermissions } from './profile-permissions';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Iniciar sesión basándonos en el email del usuario
  async login(userEmail: string) {
    const user = await this.userRepository.findOne({
      where: { userEmail },
      relations: ['userProfile'], // Incluir el perfil del usuario
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Obtener el perfil y permisos asociados al perfil del usuario
    const profileCode = user.userProfile.profileCode;

    // Generar un JWT con el perfil y permisos
    const payload = {
      sub: user.userId,
      email: user.userEmail,
      userprofileId: user.userprofileId,
      profileCode: profileCode,
      permissions: ProfilePermissions[profileCode] || [],
    };

    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
