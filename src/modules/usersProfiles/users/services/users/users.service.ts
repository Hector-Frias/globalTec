import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async getProfileById(userprofileId: string): Promise<Profile | null> {
    return this.profileRepository.findOne({
      where: { profileId: +userprofileId },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userRepository.findOne({
      where: { userEmail: createUserDto.userEmail },
    });
    try {
      if (userExists) {
        // this.logger.error(this.globalTexts.existingElement, '');
        // this.httpExceptionService.httpException(
        //   this.globalTexts.existingElement,
        //   HttpStatus.CONFLICT
        // );
      } else {
        this.userRepository.save(createUserDto);
        return { response: ' this.globalTexts.successfulCreation' };
      }
    } catch (error) {}
  }

  async listUsers() {
    const users = await this.userRepository.find();
    return users;
  }

  //list of users with their profile
  async listOfUsersProfile(searchText?: string): Promise<User[]> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userProfile', 'userProfile');

    if (searchText) {
      query.where(
        'user.userName LIKE :searchText OR user.userEmail LIKE :searchText',
        {
          searchText: `%${searchText}%`,
        },
      );
    }

    return await query.getMany();
  }

  async listUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { userId: id },
    });
    try {
      if (!user) {
        // this.logger.error(this.globalTexts.idDoesNotExist, '');
        // this.httpExceptionService.httpException(
        //   this.globalTexts.idDoesNotExist,
        //   HttpStatus.BAD_REQUEST
        // );
      } else {
        return user;
      }
    } catch (error) {}
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    await this.listUserById(id);
    try {
      const userExists = await this.userRepository.findOne({
        where: [{ userEmail: updateUserDto.userEmail }],
      });
      if (userExists && userExists.userId !== id) {
        // this.logger.error(this.globalTexts.existingElement, '');
        // this.httpExceptionService.httpException(
        //   this.globalTexts.existingElement,
        //   HttpStatus.CONFLICT
        // );
      }
      this.userRepository.update(id, updateUserDto);
      return { response: ' this.globalTexts.updateSuccessful' };
    } catch (error) {}
  }

  async deleteUser(id: number) {
    await this.listUserById(id);
    try {
      await this.userRepository.delete(id);
      return { response: 'this.globalTexts.removalSuccessful' };
    } catch (error) {}
  }
}
