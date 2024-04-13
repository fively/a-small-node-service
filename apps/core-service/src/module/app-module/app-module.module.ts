import { Module } from '@nestjs/common';
import { AppModuleController } from './app-module.controller';
import { AppModuleService } from './app-module.service';

@Module({
  controllers: [AppModuleController],
  providers: [AppModuleService]
})
export class AppModuleModule {}
