import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { mocked } from 'jest-mock'; // ✅ Important

// ✅ Move jest.mock to TOP-LEVEL
jest.mock('bcrypt');
const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AppService', () => {
  let service: AppService;
  let userRepository: Repository<User>;

  const mockUserRepo = {
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks(); // Clean mocks
  });

  describe('createUser', () => {
    const userData = { name: 'John', email: 'john@example.com', password: '1234' };
    const res = { redirect: jest.fn() };

    beforeEach(() => {
      jest.clearAllMocks();
      // ✅ Mock bcrypt.hash correctly
      (mocked(bcrypt.hash) as any).mockResolvedValue('hashedPassword123');
    });

    it('should create a user with hashed password and redirect', async () => {
      const hashedPassword = 'hashedPassword123';
      mockUserRepo.save.mockResolvedValue({ id: 1, ...userData, password: hashedPassword });

      await service.createUser(userData, res);

      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 12);
      expect(mockUserRepo.save).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
      });
      expect(res.redirect).toHaveBeenCalledWith('/users');
    });

    it('should throw ConflictException if email already exists', async () => {
      const error = { code: '23505' };
      mockUserRepo.save.mockRejectedValue(error);

      await expect(service.createUser(userData, res)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      const error = { code: 'UNKNOWN_ERROR' };
      mockUserRepo.save.mockRejectedValue(error);

      await expect(service.createUser(userData, res)).rejects.toThrow(InternalServerErrorException);
    });
  });
  // Test for getusers()
  describe('getusers', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Doe' }];
      mockUserRepo.find.mockResolvedValue(users);

      const result = await service.getusers();

      expect(result).toEqual(users);
      expect(mockUserRepo.find).toHaveBeenCalled();
    });
  });

  // Test for deleteuser()
  describe('deleteuser', () => {
    it('should delete user by id', async () => {
      mockUserRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteuser(1);

      expect(mockUserRepo.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ affected: 1 });
    });
  });

  // Test for updateuser()
  describe('updateuser', () => {
    it('should update user data if user exists', async () => {
      const existingUser = { id: 1, name: 'John' };
      const updateData = { name: 'Updated John' };

      mockUserRepo.findOne.mockResolvedValue(existingUser);
      mockUserRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateuser(1, updateData);

      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockUserRepo.update).toHaveBeenCalledWith({ id: 1 }, updateData);
      expect(result).toEqual({ affected: 1 });
    });

    it('should return error message if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      const result = await service.updateuser(1, { name: 'Test' });

      expect(result).toBe('cannot get the user so give crt id');
    });
  });

});
