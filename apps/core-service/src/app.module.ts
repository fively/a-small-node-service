import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule, EnvService } from '@common';
import { DatabaseModule } from '@db';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: EnvService.loadConfig(),
      ignoreEnvFile: false,
      isGlobal: true
    }),
    CommonModule,
    DatabaseModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
