import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { HttpExceptionService } from 'src/data/services/http-exception/http-exception.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from '../../entities/profile.entity';
import { GlobalTexts } from 'src/data/constants/texts';
import { UsersService } from '../users/users.service';
import { User } from '../../entities/user.entity';
import { HttpStatus, NotFoundException } from '@nestjs/common';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let globalTexts: any;
  let profileRepository: any;
  let httpExceptionService: any;

  const mockProfileRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    // add more methods if you need them
  };

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        UsersService,
        HttpExceptionService,
        {
          provide: getRepositoryToken(Profile),
          useValue: mockProfileRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: GlobalTexts,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    profileRepository = module.get(getRepositoryToken(Profile));
    httpExceptionService = module.get(HttpExceptionService);
    globalTexts = module.get(GlobalTexts);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //Create profile  ______________________________________
  let createProfileDto = {
    profileCode: 'testAdmin',
    profileName: 'Administrador',
  };

  it('Debería devolver un error si el perfil ya existe.', async () => {
    // Simula que el profile ya existe
    mockProfileRepository.findOne.mockResolvedValue({
      profileCode: 'testAdmin',
    });

    // Mock the httpException function so that it doesn't throw a real exception
    const mockHttpException = jest
      .spyOn(httpExceptionService, 'httpException')
      .mockImplementation(() => {});
    await service.createProfile(createProfileDto);
    expect(mockProfileRepository.save).not.toHaveBeenCalled();
    expect(mockHttpException).toHaveBeenCalledWith(
      globalTexts.existingElement,
      HttpStatus.CONFLICT,
    );
  });

  it('should create a profile if it does not exist', async () => {
    // Pretends that the user does not exist
    mockProfileRepository.findOne.mockResolvedValue(null);
    mockProfileRepository.save.mockResolvedValue(createProfileDto);
    const result = await service.createProfile(createProfileDto);
    //Verify that save has been called
    expect(mockProfileRepository.save).toHaveBeenCalledWith(createProfileDto);
    expect(result).toEqual({
      response: globalTexts.elementCreatedSuccessfully,
    });
  });

  //delet profile ________________________________________

  it('should handle the case where userRepository.delete resolves with no affected rows', async () => {
    const profileId = 1;
    mockProfileRepository.findOne.mockResolvedValue({});
    mockProfileRepository.delete.mockResolvedValue({ affected: 0 });
    globalTexts.removalSuccessful = undefined;
    const result = await service.deleteProfile(profileId);
    expect(result).toEqual({ response: undefined });
  });

  it('should throw NotFoundException if listProfileById throws it', async () => {
    const profileId = 1;
    mockProfileRepository.findOne.mockRejectedValue(
      new NotFoundException(globalTexts.elementNotFound),
    );
    await expect(service.deleteProfile(profileId)).rejects.toThrow(
      NotFoundException,
    );
    expect(profileRepository.delete).toHaveBeenCalledWith(profileId);
  });
});
