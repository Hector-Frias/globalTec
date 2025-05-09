import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UpdateProfileDto } from '../../dto/profiles/update-profile.dto';
import { CreateProfileDto } from '../../dto/profiles/create-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../../entities/profile.entity';
import { Repository } from 'typeorm';
import { GlobalTexts } from 'src/data/constants/texts';
import { HttpExceptionService } from 'src/data/services/http-exception/http-exception.service';

@Injectable()
export class ProfilesService {
  private readonly logger = new Logger(ProfilesService.name);

  constructor(
    @InjectRepository(Profile)
    private readonly profile: Repository<Profile>,
    public globalTexts: GlobalTexts,
    public httpExceptionService: HttpExceptionService,
  ) {}

  async createProfile(createProfileDto: CreateProfileDto) {
    const profileExists = await this.profile.findOne({
      where: { profileCode: createProfileDto.profileCode },
    });
    try {
      if (profileExists) {
        this.logger.error(this.globalTexts.existingElement, '');
        this.httpExceptionService.httpException(
          this.globalTexts.existingElement,
          HttpStatus.CONFLICT,
        );
      } else {
        this.profile.save(createProfileDto);
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

  async listProfile() {
    try {
      const profile = await this.profile.find();
      return profile;
    } catch (error) {
      this.logger.error(this.globalTexts.anErrorOccurred, error.stack);
      this.httpExceptionService.httpException(
        error.message,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async listProfileById(id: number) {
    const profile = await this.profile.findOne({
      where: { profileId: id },
    });
    try {
      if (!profile) {
        this.logger.error(this.globalTexts.idDoesNotExist, '');
        this.httpExceptionService.httpException(
          this.globalTexts.idDoesNotExist,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        return profile;
      }
    } catch (error) {
      this.logger.error(this.globalTexts.anErrorOccurred, error.stack);
      this.httpExceptionService.httpException(
        error.message,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateProfile(id: number, updateProfileDto: UpdateProfileDto) {
    await this.listProfileById(id);
    try {
      const profileExists = await this.profile.findOne({
        where: [{ profileCode: updateProfileDto.profileCode }],
      });
      if (profileExists && profileExists.profileId !== id) {
        this.logger.error(this.globalTexts.existingElement, '');
        this.httpExceptionService.httpException(
          this.globalTexts.existingElement,
          HttpStatus.CONFLICT,
        );
      }
      this.profile.update(id, updateProfileDto);
      return { response: this.globalTexts.updateSuccessful };
    } catch (error) {}
  }

  async deleteProfile(id: number) {
    await this.listProfileById(id);
    try {
      await this.profile.delete(id);
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
