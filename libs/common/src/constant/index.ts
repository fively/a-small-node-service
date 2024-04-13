export const REQUEST_ID_TOKEN_HEADER = 'X-Request-ID';

export const APP_ID_HEADER = 'x-app-id';

// export const FORWARDED_FOR_TOKEN_HEADER = 'X-Forwarded-For';

export enum ErrorCode {
  // 正常结果
  SUCCESS = 0,

  // 账号或密码错误
  ACCOUNT_ERROR = 10000
}

export const MESSAGE_SERVICE = 'message';

export const IS_PUBLIC_KEY = 'IS_PUBLIC';

export const AUTHORIZATION_ENFORCER = 'authorization_enforcer';
