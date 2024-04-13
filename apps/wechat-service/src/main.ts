import { NestFactory } from '@nestjs/core';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const fastifyHelmet = require('@fastify/helmet');

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // 加载系统配置
  const config = app.get(ConfigService);

  app.enableCors();
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`]
      }
    }
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: false, // 请求参数中有无效属性时是否抛出错误
      skipMissingProperties: true,
      transform: true, // 将参数转换为dto实例
      whitelist: true, // 剔除请求参数中的无效属性
      validateCustomDecorators: true,
      stopAtFirstError: true,
      transformOptions: {
        enableImplicitConversion: true
      },
      exceptionFactory: (validationErrors = []) => {
        return new Error(Object.values(validationErrors[0].constraints)[0]);
      }
    })
  );

  if (process.env.NODE_ENV !== 'production') {
    /* 集成api文档*/
    SwaggerModule.setup(
      config.get('DOCUMENT.path'),
      app,
      SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
          .setTitle(config.get('DOCUMENT.title'))
          .setDescription(config.get('DOCUMENT.description'))
          .setVersion(config.get('DOCUMENT.version'))
          .build()
      )
    );
  } else {
    // 增加sentry监控 @sentry/node
  }

  // 接口版本化管理
  app.enableVersioning({ type: VersioningType.URI });

  const port = parseInt(process.env.PORT, 10) || 4002;
  await app.listen(port, '127.0.0.1');

  console.info(`url: http://127.0.0.1:${port}, env: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
