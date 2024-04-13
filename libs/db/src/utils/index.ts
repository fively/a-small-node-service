import 'reflect-metadata';

/**
 * class类装饰器，设置class类对应的tableName
 * @param name 表名
 * @returns
 */
export const Table = (name: string) => {
  return (target: any) => {
    Reflect.defineMetadata('tableName', name, target);
  };
};
