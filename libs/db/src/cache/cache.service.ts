import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheService {
  constructor(@Inject('REDIS_CLIENT') private client: RedisClientType) {}

  /**
   * 设置缓存
   * @param key 键
   * @param value 值(字符型)
   * @param second 过期时间，单位：秒
   */
  async set(key: string, value: any, second: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), { EX: second });
  }
  /**
   * 获取缓存
   * @param key 键
   * @returns
   */
  async get(key: string): Promise<string | undefined> {
    let value = await this.client.get(key);
    try {
      value = JSON.parse(value);
    } catch (error) {
      value = '';
    }
    return value;
  }
  /**
   * 删除缓存
   * @param key 键
   */
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  /**
   * 累加
   * @param key
   * @param value
   */
  async incr(key: string): Promise<void> {
    await this.client.incr(key);
  }
}
