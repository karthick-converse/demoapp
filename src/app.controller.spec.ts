import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Create_user } from './dto/create.user.dto';
import { Response } from 'express';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockAppService = {
    createUser: jest.fn(),
    getusers: jest.fn(),
    deleteuser: jest.fn(),
    updateuser: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test: index page
  describe('indexpage', () => {
    it('should render index page', () => {
      const result = appController.indexpage();
      expect(result).toEqual({});
    });
  });

  // Test: adduser page
  describe('adduserpage', () => {
    it('should render adduser page', () => {
      const result = appController.adduserpage();
      expect(result).toEqual({});
    });
  });

  // Test: create user
  describe('getHello', () => {
    it('should call AppService.getHello with user data and response', async () => {
      const userData: Create_user = { name: 'John', email: 'john@example.com', password: '1234' };
      const res: any = {}; // Mock response
      mockAppService.createUser.mockResolvedValue('Redirected');

      const result = await appController.getHello(userData, res);

      expect(mockAppService.createUser).toHaveBeenCalledWith(userData, res);
      expect(result).toBe('Redirected');
    });
  });

  // Test: get all users
  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Doe' }];
      mockAppService.getusers.mockResolvedValue(users);

      const result = await appController.getAllUsers();

      expect(mockAppService.getusers).toHaveBeenCalled();
      expect(result).toEqual({ users });
    });
  });

// deleteUser test
describe('deleteUser', () => {
    it('should delete user by id', async () => {
      mockAppService.deleteuser.mockResolvedValue({ affected: 1 });
  
      const result = await appController.deleteUser(1);
  
      expect(mockAppService.deleteuser).toHaveBeenCalledWith(1);
      // You don't need to check the return value because @Redirect handles it
      expect(result).toBeUndefined();
    });
  });
  

  // Test: edit user
  describe('editUser', () => {
    it('should return user data by id', async () => {
      const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Doe' }];
      mockAppService.getusers.mockResolvedValue(users);

      const result = await appController.editUser(1);

      expect(mockAppService.getusers).toHaveBeenCalled();
      expect(result).toEqual({ user: users[0] });
    });
  });

 // updateUser test
describe('updateUser', () => {
    it('should update user and redirect', async () => {
      mockAppService.updateuser.mockResolvedValue({ affected: 1 });
  
      const result = await appController.updateUser(1, { name: 'Updated' });
  
      expect(mockAppService.updateuser).toHaveBeenCalledWith(1, { name: 'Updated' });
      expect(result).toBeUndefined(); // Because redirection happens via @Redirect
    });
  });
});
