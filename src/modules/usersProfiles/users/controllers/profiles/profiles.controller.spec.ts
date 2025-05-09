import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from '../../services/profiles/profiles.service';
import { HttpExceptionService } from 'src/data/services/http-exception/http-exception.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from '../../entities/profile.entity';
import { GlobalTexts } from 'src/data/constants/texts';
import { User } from '../../entities/user.entity';
import { UsersService } from '../../services/users/users.service';

describe('ProfilesController', () => {
  let controller: ProfilesController;

  const mockProfileRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    // add more methods if you need them
  };

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
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

    controller = module.get<ProfilesController>(ProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
