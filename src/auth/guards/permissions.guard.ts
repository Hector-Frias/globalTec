import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ProfilePermissions } from '../profile-permissions';
import { UsersService } from 'src/modules/usersProfiles/users/services/users/users.service';
import { GlobalTexts } from 'src/data/constants/texts';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
    public globalTexts: GlobalTexts,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const userprofileId = user.userprofileId; // we make sure we have the userProfileId

    // We obtain the user profile from the userProfileId
    const profile = await this.usersService.getProfileById(userprofileId);

    if (!profile) {
      throw new ForbiddenException(this.globalTexts.userProfileNotFound);
    }

    const profileCode = profile.profileCode; //Get the profileCode of the profile

    const userPermissions = ProfilePermissions[profileCode] || [];

    const hasPermission = requiredPermissions.every((p) =>
      userPermissions.includes(p),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        this.globalTexts.youDoNotHavePermissionForThisAction,
      );
    }

    return true;
  }
}
