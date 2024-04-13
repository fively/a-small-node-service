import { Test, TestingModule } from '@nestjs/testing';
import { AppModuleService } from './app-module.service';

describe('AppModuleService', () => {
  let service: AppModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppModuleService]
    }).compile();

    service = module.get<AppModuleService>(AppModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
