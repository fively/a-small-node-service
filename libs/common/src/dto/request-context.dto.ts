/**
 * 请求对象体
 */
export interface RequestContextDto {
  requestId: string;
  appId: string;
  url: string;
  ip: string;
  user: UserDto;
}

export interface UserDto {
  userId: string;
  userName: string;
  account: string;
  roles: Array<string>;
}
