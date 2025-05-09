import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { HttpExceptionService } from 'src/data/services/http-exception/http-exception.service';
import { GlobalTexts } from 'src/data/constants/texts';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Profile } from '../../entities/profile.entity';
import { HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let profileRepository: any;
  let userRepository: any;
  let httpExceptionService: any;
  let globalTexts: any;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
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

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    httpExceptionService = module.get(HttpExceptionService);
    globalTexts = module.get(GlobalTexts);
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

    // Mockear la función httpException para que no lance una excepción real
    const mockHttpException = jest
      .spyOn(httpExceptionService, 'httpException')
      .mockImplementation(() => {});

    // Llama al método create y espera que se ejecute
    await service.create(createUserDto);

    // Verifica que no se haya guardado el usuario porque ya existe
    expect(mockUserRepository.save).not.toHaveBeenCalled();

    // Verifica que se haya llamado a httpException con el mensaje adecuado
    expect(mockHttpException).toHaveBeenCalledWith(
      globalTexts.existingElement,
      HttpStatus.CONFLICT,
    );
  });

  it('should create a user if it does not exist', async () => {
    // Pretends that the user does not exist
    mockUserRepository.findOne.mockResolvedValue(null);
    mockUserRepository.save.mockResolvedValue(createUserDto);

    const result = await service.create(createUserDto);

    //Verify that save has been called
    expect(mockUserRepository.save).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual({
      response: globalTexts.elementCreatedSuccessfully,
    });
  });
});
