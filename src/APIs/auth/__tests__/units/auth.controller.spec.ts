import { Test } from '@nestjs/testing';
import { AuthController } from '../../auth.controller';

class MockAuthService {
  getJWT() {
    return {
      accessToken: 'accesstoken',
      refreshToken: 'refreshtoken',
    };
  }
}

describe('AuthControler', () => {
  let controller;
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [MockAuthService],
    }).compile();

    controller = module.get(AuthController);
    service = module.get(MockAuthService);
  });

  describe('signup', () => {
    it('returns access & refresh tokens', () => {});
  });
});
