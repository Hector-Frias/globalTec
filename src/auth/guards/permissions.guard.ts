import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ProfilePermissions } from '../profile-permissions';
import { UsersService } from 'src/modules/usersProfiles/users/services/users/users.service'; // Asegúrate de tener acceso al servicio de usuarios

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService, // Inyectamos el servicio de usuarios
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const userprofileId = user.userprofileId; // Asegúrate de que tienes el userProfileId

    // Obtener el perfil del usuario a partir del userProfileId
    const profile = await this.usersService.getProfileById(userprofileId);

    if (!profile) {
      throw new ForbiddenException('Perfil de usuario no encontrado');
    }

    const profileCode = profile.profileCode; // Obtén el profileCode del perfil

    const userPermissions = ProfilePermissions[profileCode] || [];

    const hasPermission = requiredPermissions.every((p) =>
      userPermissions.includes(p),
    );

    if (!hasPermission) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    return true;
  }
}
