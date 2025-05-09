import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { HttpExceptionService } from 'src/data/services/http-exception/http-exception.service';
import { GlobalTexts } from 'src/data/constants/texts';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Profile } from '../../entities/profile.entity';
import { HttpStatus, Logger, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let profileRepository: any;
  let userRepository: any;
  let httpExceptionService: any;
  let globalTexts: any;
  let logger: any;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    // add more methods if you need them
  };

  const mockProfileRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: HttpExceptionService,
          useValue: { httpException: jest.fn() }, // Proporciona el mock directamente aquí
        },
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
        {
          provide: Logger,
          useValue: { error: jest.fn() }, // Mockea el método error del Logger
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    httpExceptionService = module.get(HttpExceptionService);
    globalTexts = module.get(GlobalTexts);
    logger = module.get(Logger);
  });

  profileRepository = {
    findOne: jest.fn(),
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //That getProfileById correctly converts the string to a number.
  //That it calls findOne with the correct condition.
  //That it returns the result from the repository unaltered.
  it('should return profile by id', async () => {
    const mockProfile = { profileId: 1 };
    mockProfileRepository.findOne.mockResolvedValue(mockProfile);

    const result = await service.getProfileById('1');
    expect(result).toEqual(mockProfile);
    expect(mockProfileRepository.findOne).toHaveBeenCalledWith({
      where: { profileId: 1 },
    });
  });

  //Create user  ______________________________________
  let createUserDto = {
    userEmail: 'test@example.com',
    userName: 'John Doe',
    userAge: 30,
    userprofileId: 1,
  };

  it('should return an error if the user already exists', async () => {
    // Simula que el usuario ya existe
    mockUserRepository.findOne.mockResolvedValue({
      userEmail: 'test@example.com',
    });

    // Mock the httpException function so that it doesn't throw a real exception
    const mockHttpException = jest
      .spyOn(httpExceptionService, 'httpException')
      .mockImplementation(() => {});
    await service.createUser(createUserDto);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockHttpException).toHaveBeenCalledWith(
      globalTexts.existingElement,
      HttpStatus.CONFLICT,
    );
  });

  it('should create a user if it does not exist', async () => {
    // Pretends that the user does not exist
    mockUserRepository.findOne.mockResolvedValue(null);
    mockUserRepository.save.mockResolvedValue(createUserDto);
    const result = await service.createUser(createUserDto);
    //Verify that save has been called
    expect(mockUserRepository.save).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual({
      response: globalTexts.elementCreatedSuccessfully,
    });
  });

  //delet users ________________________________________

  it('should handle the case where userRepository.delete resolves with no affected rows', async () => {
    const userId = 1;
    mockUserRepository.findOne.mockResolvedValue({});
    mockUserRepository.delete.mockResolvedValue({ affected: 0 });
    globalTexts.removalSuccessful = undefined;
    const result = await service.deleteUser(userId);
    expect(result).toEqual({ response: undefined });
  });

  //list by ID ____________________________

  it('should throw NotFoundException if listUserById throws it', async () => {
    const userId = 1;
    mockUserRepository.findOne.mockRejectedValue(
      new NotFoundException(globalTexts.elementNotFound),
    );
    await expect(service.deleteUser(userId)).rejects.toThrow(NotFoundException);
    expect(userRepository.delete).toHaveBeenCalledWith(userId);
  });

  it('should return a user if found by ID', async () => {
    const mockUser = { userId: 1, userName: 'Test User' };
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    const result = await service.listUserById(1);

    expect(result).toEqual(mockUser);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { userId: 1 },
    });
    expect(httpExceptionService.httpException).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });
});
