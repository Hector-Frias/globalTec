import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/usersProfiles/users/entities/user.entity';
import { ProfilePermissions } from './profile-permissions';
import { GlobalTexts } from 'src/data/constants/texts';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    public globalTexts: GlobalTexts,
  ) {}

  // Log in based on the user's email
  async login(userEmail: string) {
    const user = await this.userRepository.findOne({
      where: { userEmail },
      relations: ['userProfile'],
    });

    if (!user) {
      throw new Error(this.globalTexts.userNotFound);
    }

    //Get the profile and permissions associated with the user profile
    const profileCode = user.userProfile.profileCode;

    //Generate a JWT with the profile and permissions
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
