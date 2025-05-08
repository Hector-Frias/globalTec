import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { User } from '../../entities/user.entity';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permissions('create_user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Permissions('read_user')
  listUsers() {
    return this.usersService.listUsers();
  }

  @Get('/usersProfiles')
  @Permissions('read_user')
  async listOfUsersProfile(
    @Query('searchText') searchText?: string,
  ): Promise<User[]> {
    return await this.usersService.listOfUsersProfile(searchText);
  }

  @Get(':id')
  @Permissions('read_user')
  listUserById(@Param('id') id: string) {
    return this.usersService.listUserById(+id);
  }

  @Patch(':id')
  @Permissions('edit_user')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  @Permissions('delete_user')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}
