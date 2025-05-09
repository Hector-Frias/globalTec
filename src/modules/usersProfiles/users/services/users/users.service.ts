import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '../../dto/users/create-user.dto';
import { UpdateUserDto } from '../../dto/users/update-user.dto';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../entities/profile.entity';
import { GlobalTexts } from 'src/data/constants/texts';
import { HttpExceptionService } from 'src/data/services/http-exception/http-exception.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    public globalTexts: GlobalTexts,
    public httpExceptionService: HttpExceptionService,
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
        this.logger.error(this.globalTexts.existingElement, '');
        this.httpExceptionService.httpException(
          this.globalTexts.existingElement,
          HttpStatus.CONFLICT,
        );
      } else {
        this.userRepository.save(createUserDto);
        return { response: this.globalTexts.elementCreatedSuccessfully };
      }
    } catch (error) {
      this.logger.error(this.globalTexts.anErrorOccurred, error.stack);
      this.httpExceptionService.httpException(
        error.message,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async listUsers() {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch (error) {
      this.logger.error(this.globalTexts.anErrorOccurred, error.stack);
      this.httpExceptionService.httpException(
        error.message,
        HttpStatus.NOT_FOUND,
      );
    }
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
        this.logger.error(this.globalTexts.idDoesNotExist, '');
        this.httpExceptionService.httpException(
          this.globalTexts.idDoesNotExist,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        return user;
      }
    } catch (error) {
      this.logger.error(this.globalTexts.anErrorOccurred, error.stack);
      this.httpExceptionService.httpException(
        error.message,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    await this.listUserById(id);
    try {
      const userExists = await this.userRepository.findOne({
        where: [{ userEmail: updateUserDto.userEmail }],
      });
      if (userExists && userExists.userId !== id) {
        this.logger.error(this.globalTexts.existingElement, '');
        this.httpExceptionService.httpException(
          this.globalTexts.existingElement,
          HttpStatus.CONFLICT,
        );
      }
      this.userRepository.update(id, updateUserDto);
      return { response: this.globalTexts.updateSuccessful };
    } catch (error) {
      this.logger.error(this.globalTexts.anErrorOccurred, error.stack);
      this.httpExceptionService.httpException(
        error.message,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async deleteUser(id: number) {
    await this.listUserById(id);
    try {
      await this.userRepository.delete(id);
      return { response: this.globalTexts.removalSuccessful };
    } catch (error) {
      this.logger.error(this.globalTexts.anErrorOccurred, error.stack);
      this.httpExceptionService.httpException(
        error.message,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
