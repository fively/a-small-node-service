import { Test, TestingModule } from '@nestjs/testing';
import { AppModuleController } from './app-module.controller';

describe('AppModuleController', () => {
  let controller: AppModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppModuleController]
    }).compile();

    controller = module.get<AppModuleController>(AppModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
