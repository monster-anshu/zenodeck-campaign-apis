import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { ZodValidationPipe, patchNestJsSwagger } from 'nestjs-zod';
import { AppModule } from '~/app.module';
import { PORT } from '~/env';
import { SessionMiddlewareFn } from './session/session.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(morgan('tiny'));
  app.use(SessionMiddlewareFn);

  app.setGlobalPrefix('/api/v1/campaign');
  app.useGlobalPipes(new ZodValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Zenodeck Campaign Apis')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    useGlobalPrefix: true,
  });

  await app.listen(PORT, '0.0.0.0');
}

patchNestJsSwagger();
bootstrap();
