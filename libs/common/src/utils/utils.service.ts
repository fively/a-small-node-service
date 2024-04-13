import { FastifyRequest } from 'fastify';
import { registerAs } from '@nestjs/config';
import { parse } from 'yaml';
import { join } from 'node:path';
import { readFileSync, readdirSync } from 'node:fs';
import { v4 as uuid } from 'uuid';
import * as requestIp from 'request-ip';
import { RequestContextDto } from '../dto';
import { APP_ID_HEADER, REQUEST_ID_TOKEN_HEADER } from '../constant';
import * as dayjs from 'dayjs';

export class UtilsService {
  /**
   * 获取当前运行环境
   * @returns
   */
  static getEnv = (): string => {
    return process.env.NODE_ENV || 'development';
  };

  /**
   * 初始化配置文件
   * @param dir 应用目录
   * @returns
   */
  static initConfig(dir: string) {
    const environment = this.getEnv();
    let cfg = {} as object;

    // 获取环境变量配置信息
    const _rootFile = readFileSync(join(process.cwd(), `./.config/.${environment}.yaml`), 'utf8');
    cfg = Object.assign(cfg, parse(_rootFile));

    /* 读取应用配置信息 */
    const configFileDir = `${dir}/config`;
    const configFile = readdirSync(configFileDir);
    configFile.forEach(item => {
      const file = readFileSync(`${configFileDir}/${item}`, 'utf8');
      cfg = Object.assign(cfg, parse(file));
    });

    const files = [];

    Object.keys(cfg).forEach(key => {
      files.push(registerAs(key, () => cfg[key]));
    });

    return files;
  }

  /**
   * 生成uuid
   * @returns
   */
  static uuid(): string {
    return uuid().replace(/-/g, '');
  }

  /**
   * 创建请求对象
   * @param request
   * @returns
   */
  static createRequestContext(request: FastifyRequest): RequestContextDto {
    const context: RequestContextDto = {} as RequestContextDto;

    context.requestId = request.headers[REQUEST_ID_TOKEN_HEADER]?.toString() || '';
    context.appId = request.headers[APP_ID_HEADER]?.toString() || '';
    context.url = request.url || '';

    // 获取ip地址
    // context.ip = request.headers[FORWARDED_FOR_TOKEN_HEADER]?.toString() ? request.headers[FORWARDED_FOR_TOKEN_HEADER]?.toString() : request.ip;
    context.ip = requestIp.getClientIp(request) || '';

    // 记录授权用户信息
    context.user = request['user'];

    return context;
  }

  /**
   * 获取当前时间
   * @param value
   * @param format
   * @returns
   */
  static getCurrentDate(value = '', format = 'YYYY-MM-DD HH:mm:ss') {
    if (value) {
      return dayjs(value).format(format);
    }
    return dayjs().format(format);
  }
}
