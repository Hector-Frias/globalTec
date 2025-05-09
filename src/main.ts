import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const environment = process.env.ENVIRONMENT || 'development';
  if (environment !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('GLOBAL API')
      .setDescription('Endpoints')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docApi', app, documentFactory);
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
