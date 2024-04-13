import { CryptoService } from '@common';
import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('public - 认证/授权')
@Controller('public')
export class PublicController {
  @Inject(CryptoService)
  private readonly cryptoService: CryptoService;

  @Get('auth-key')
  @ApiOperation({ summary: '公共KEY' })
  async publicKey() {
    return this.cryptoService.getPublicKey();
  }
}
