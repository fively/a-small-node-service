import { Controller, Inject, Get, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MpService } from './mp.service';

@ApiTags('mp - 微信公众号类')
@Controller('mp')
export class MpController {
  @Inject(MpService) private readonly mpService: MpService;

  @Get('signature')
  @ApiOperation({ summary: '获取微信签名' })
  async signature(@Query() query) {
    const { url } = query;
    return this.mpService.getSignature(url);
  }

  @Get('authorize')
  @ApiOperation({ summary: '获取微信签名' })
  async authorize(@Query() query: any, @Res() res) {
    const { code, source, rd } = query;
    if (!rd) {
      throw new HttpException('回调地址不正确', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    let rdUrl = Buffer.from(rd, 'base64').toString('utf-8');

    if (rd.indexOf('?') >= 0) {
      rdUrl = rdUrl + '&source=' + source || '';
    } else {
      rdUrl = rdUrl + '?source=' + source || '';
    }

    if (code) {
      const openId = await this.mpService.getOAuthOpenId(code);
      rdUrl = rdUrl + '&openid=' + openId || '';
    }

    return res.status(307).redirect(rdUrl);
  }

  @Get('authorize-token')
  @ApiOperation({ summary: '获取签名授权' })
  async authorizeToken(@Query() query: any, @Res() res) {
    const { code, source, rd } = query;
    if (!rd) {
      throw new HttpException('回调地址不正确', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    let rdUrl = Buffer.from(rd, 'base64').toString('utf-8');

    if (rd.indexOf('?') >= 0) {
      rdUrl = rdUrl + '&source=' + source || '';
    } else {
      rdUrl = rdUrl + '?source=' + source || '';
    }

    if (code) {
      const openId = await this.mpService.getOAuthToken(code);
      rdUrl = rdUrl + '&token=' + openId || '';
    }

    return res.status(307).redirect(rdUrl);
  }
}
