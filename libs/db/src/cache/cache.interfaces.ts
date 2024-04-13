export interface ICacheOptions {
  useFactory?: (...args: any[]) => Promise<any>;
  inject?: any[];
  isGlobal?: boolean;
}
