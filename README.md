# A-Small-Node-Service

A Small Node Service

### 说明
Nest.js、Fastify、Knex

### 目录
    - apps                   服务相关
        - core-service       基础服务相关
        - wechat-service     微信对接服务相关
    
    - docs                   文档相关

    - libs                   公共类库
        - auth               身份/权限
        - common             公共逻辑
        - db                 数据库相关

    - scripts                相关脚本

    - ecosystem.config.js    PM2配置
    

### 安装

```
pnpm install
```

### 启动

```
pnpm [run] start core-service
```
注：core-service是apps中对应应用


### 参考
掘金课程/文档、github项目、网络课程等等