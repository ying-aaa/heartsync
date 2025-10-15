import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 忽略 DTO 中未定义的属性
      forbidNonWhitelisted: true, // 禁止未定义的属性
      transform: true, // 自动转换请求体为 DTO 类型
      // exceptionFactory: (errors) => {
      //   const errorMessages = errors.map((err) => {
      //     return {
      //       field: err.property,
      //       message: Object.values(err.constraints)[0], // 取第一个错误信息
      //     };
      //   });
      //   return new BadRequestException(errorMessages);
      // },
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor()); // 全局应用拦截器

  // 设置请求体大小限制为 1gb
  app.use(bodyParser.json({ limit: '1gb' }));
  app.use(bodyParser.urlencoded({ limit: '1gb', extended: true }));
  await app.listen(3000);
}
bootstrap();
