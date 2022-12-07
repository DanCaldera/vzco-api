import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV !== 'production'
        ? ['log', 'error', 'warn', 'debug', 'verbose']
        : ['error', 'warn'],
  });
  app.setGlobalPrefix(`api/${process.env.API_VERSION}`);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Todos-Waitlist-Saas API')
    .setDescription('The Todos API description')
    .setVersion(process.env.npm_package_version)
    .addTag('app')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
