import { Module } from '@nestjs/common';
import { NavController } from './nav.controller';
import { NavService } from './nav.service';

@Module({
  controllers: [NavController],
  providers: [NavService]
})
export class NavModule {}
