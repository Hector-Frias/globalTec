import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { HttpExceptionService } from 'src/data/services/http-exception/http-exception.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from '../../entities/profile.entity';
import { GlobalTexts } from 'src/data/constants/texts';
import { UsersService } from '../users/users.service';
import { User } from '../../entities/user.entity';

describe('ProfilesService', () => {
  let service: ProfilesService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
