import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from '../../dto/profiles/update-profile.dto';
import { CreateProfileDto } from '../../dto/profiles/create-profile.dto';

@Injectable()
export class ProfilesService {
  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
