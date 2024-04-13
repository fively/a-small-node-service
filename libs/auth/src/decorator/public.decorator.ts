import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constant';

/**
 * 是否校验身份装饰器
 * @returns
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
