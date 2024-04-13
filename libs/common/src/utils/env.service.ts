import { registerAs } from '@nestjs/config';
import { parse } from 'yaml';
import { basename, resolve } from 'node:path';
import { readFileSync, readdirSync, existsSync } from 'node:fs';

export class EnvService {
  /**
   * 获取当前运行环境
   * @returns
   */
  static getEnv = (): string => {
    return process.env.NODE_ENV || 'development';
  };

  /**
   * 加载环境变量
   * @param appName
   */
  static loadConfig() {
    const appDir = resolve(__dirname);
    const appName = basename(appDir);
    const mode = this.getEnv();
    let _Config = {};

    // 获取应用对应的配置信息并注册
    const _appConfigPath = resolve(process.cwd(), `./.${mode}/${appName}.yaml`);
    if (existsSync(_appConfigPath)) {
      const _appConfig = readFileSync(_appConfigPath, 'utf8');
      _Config = parse(_appConfig);
    }

    // 获取公共配置信息并注册 (公共配置优先级高于应用配置)
    const _commonConfigPath = resolve(process.cwd(), `./.${mode}/common.yaml`);
    if (existsSync(_commonConfigPath)) {
      const _commonConfig = readFileSync(_commonConfigPath, 'utf8');
      _Config = Object.assign({}, _Config, parse(_commonConfig));
    }

    // 读取应用内配置信息并注册
    const appConfigDir = resolve(__dirname, `./config`);
    if (existsSync(appConfigDir)) {
      const appConfigFile = readdirSync(appConfigDir);
      appConfigFile.forEach(item => {
        const file = readFileSync(`${appConfigDir}/${item}`, 'utf8');
        _Config = Object.assign({}, _Config, parse(file));
      });
    }

    // 读取应用env环境信息
    return Object.keys(_Config).map(key => {
      return registerAs(key, () => _Config[key]);
    });
  }
}
