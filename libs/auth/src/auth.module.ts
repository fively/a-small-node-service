import { Global, Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AclService } from './service/acl.service';

@Global()
@Module({
  providers: [AuthService, AclService],
  exports: [AuthService, AclService]
})
export class AuthModule {}
