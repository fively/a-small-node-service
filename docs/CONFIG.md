## 配置相关

为了区分测试和生产环境，所以将测试和生产环境配置分开。配置文件存放在项目根目录下(参考.example)
```
    - a-small-node-service
        - .development
            - common.yaml          应用公共配置
            - core-service.yaml    core-service配置
            - wechat-service.yaml  wechat-service配置
            ...

        - .production
            - common.yaml          应用公共配置
            - core-service.yaml    core-service配置
            - wechat-service.yaml  wechat-service配置
            ...

```

### 数据库

数据库使用：mysql8.0
```
pnpm i knex
pnpm i mysql2
```

数据库使用：mysql5.7
```
pnpm i knex
pnpm i mysql
```

### 缓存
缓存使用的是：redis
