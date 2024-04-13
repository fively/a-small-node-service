import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as superagent from 'superagent';
import { CacheService } from '@db';
import * as Constant from '@/constant';
import { v1 as uuidv1 } from 'uuid';
import * as crypto from 'crypto';
import { UtilsService } from '@common';

@Injectable()
export class MpService {
  @Inject(CacheService) private readonly cacheService: CacheService;
  @Inject(ConfigService) private readonly configService: ConfigService;

  /**
   * 获取access token
   * @param appId 公众号开发者账号
   * @param appSecret 公众号开发者密钥
   * @returns
   */
  async getAccessToken(): Promise<string> {
    const appId = this.configService.get('WECHAT.appId');
    const appSecret = this.configService.get('WECHAT.appSecret');

    const _cacheKey = `wechat:access_token:${appId}`;

    // 读取缓存
    const access_token: string = await this.cacheService.get(_cacheKey);
    if (access_token) {
      return access_token;
    }

    try {
      const result = await superagent.get(Constant.ACCESS_TOKEN_URL).query({
        grant_type: 'client_credential',
        appid: appId,
        secret: appSecret
      });

      const { errcode, errmsg, access_token } = JSON.parse(result.text || '{}');
      if (errcode) {
        throw new HttpException(errcode + '-' + errmsg, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // 写入缓存
      await this.cacheService.set(_cacheKey, access_token, 6000);

      return access_token;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 获取ticket
   */
  async getTicket() {
    const appId = this.configService.get('WECHAT.appId');

    const _cacheKey = `wechat:ticket:${appId}`;
    // 读取缓存
    const ticket: string = await this.cacheService.get(_cacheKey);
    if (ticket) {
      return ticket;
    }

    try {
      const access_token = await this.getAccessToken();
      const result = await superagent.get(Constant.TICKET_URL).query({
        access_token,
        type: 'jsapi'
      });

      const { errcode, errmsg, ticket } = JSON.parse(result.text || '{}');
      if (errcode) {
        throw new HttpException(errcode + '-' + errmsg, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // 写入缓存
      await this.cacheService.set(_cacheKey, ticket, 6000);

      return ticket;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 获取微信分享签名
   * @param url
   * @returns
   */
  async getSignature(url: string) {
    if (!url) {
      throw new HttpException('签名地址不正确', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const ticket = await this.getTicket();

    const timestamp = new Date().getTime() / 1000;
    const nonceStr = uuidv1();

    const str = 'jsapi_ticket=' + ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url;
    const signature = crypto.createHash('sha1').update(str, 'utf8').digest('hex');
    return {
      appId: this.configService.get('WECHAT.appId'),
      timestamp: timestamp,
      nonceStr: nonceStr,
      signature: signature
    };
  }

  /**
   * 获取微信用户信息
   * @param access_token access token
   * @param openId 微信号
   * @returns
   */
  async getWechatUser(access_token: string, openId: string) {
    const _result = await superagent.get(Constant.USER_INFO_URL).query({
      access_token: access_token,
      openid: openId,
      lang: 'zh_CN'
    });

    const result = JSON.parse(_result.text || '{}');
    if (result.errcode) {
      throw new HttpException(result.errcode + '-' + result.errmsg, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result;
  }

  /**
   * 获取永久二维码
   * @param access_token access token
   * @param sceneContent 场景内容
   */
  async createLimitQrCode(access_token: string, sceneContent: string) {
    const url = `${Constant.QR_LIMIT_STR_SCENE_URL}?access_token=${access_token}`;
    const _result = await superagent
      .post(url)
      .send({ action_name: 'QR_LIMIT_STR_SCENE', action_info: { scene: { scene_str: sceneContent } } });

    const result = JSON.parse(_result.text || '{}');
    if (result.errcode) {
      throw new HttpException(result.errcode + '-' + result.errmsg, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result;
  }

  /**
   * 根据ticket获取二维码
   * @param ticket
   * @returns
   */
  async getQrCode(ticket: string) {
    const _result = await superagent.get(Constant.QR_SHOW_URL).query({
      ticket
    });

    return _result._body;
  }

  /**
   * 发送模版消息
   * @param access_token
   * @param msgBody
   */
  async sendTemplateMsg(access_token: string, msgBody: any) {
    const url = `${Constant.TEMPLATE_SEND_URL}?access_token=${access_token}`;
    const _result = await superagent.post(url).send(msgBody);

    const result = JSON.parse(_result.text || '{}');
    if (result.errcode) {
      throw new HttpException(result.errcode + '-' + result.errmsg, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result;
  }

  /**
   * 获取授权openId
   * @param code
   * @returns
   */
  async getOAuthOpenId(code: string) {
    const appId = this.configService.get('WECHAT.appId');
    const appSecret = this.configService.get('WECHAT.appSecret');

    const url = `${Constant.OAUTH_TOKEN_URL}?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`;
    const _result = await superagent.post(url).send(url);

    const result = JSON.parse(_result.text || '{}');
    if (result.errcode) {
      throw new HttpException(result.errcode + '-' + result.errmsg, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result.openid;
  }

  /**
   * 获取授权token
   * @param code
   * @returns
   */
  async getOAuthToken(code: string) {
    const appId = this.configService.get('WECHAT.appId');
    const appSecret = this.configService.get('WECHAT.appSecret');

    const url = `${Constant.OAUTH_TOKEN_URL}?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`;
    const _result = await superagent.post(url).send(url);

    const result = JSON.parse(_result.text || '{}');
    if (result.errcode) {
      throw new HttpException(result.errcode + '-' + result.errmsg, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const _cacheKey = UtilsService.uuid() + new Date().getTime();
    await this.cacheService.set(
      `wechat:token:${_cacheKey}`,
      { userId: result.openid, userName: result.openid, account: result.openid },
      60 * 60 * 24 * 1
    );

    return _cacheKey;
  }
}
