import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from '../../services/profiles/profiles.service';
import { CreateProfileDto } from '../../dto/profiles/create-profile.dto';
import { UpdateProfileDto } from '../../dto/profiles/update-profile.dto';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('profiles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @Permissions('create_user')
  createProfile(@Body() createUserDto: CreateProfileDto) {
    return this.profilesService.createProfile(createUserDto);
  }

  @Get()
  @Permissions('read_user')
  listProfile() {
    return this.profilesService.listProfile();
  }

  @Get(':id')
  @Permissions('read_user')
  listProfileById(@Param('id') id: string) {
    return this.profilesService.listProfileById(+id);
  }

  @Patch(':id')
  @Permissions('edit_user')
  updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfile(+id, updateUserDto);
  }

  @Delete(':id')
  @Permissions('delete_user')
  deleteProfile(@Param('id') id: string) {
    return this.profilesService.deleteProfile(+id);
  }
}
