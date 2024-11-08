import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 5000;
  const reactOrigin = 'http://localhost:3000';

  const config = new DocumentBuilder()
    .setTitle('Org scanner API')
    .setDescription('backend api for org scanner app')
    .setVersion('1.0')
    .addTag('Org scanner')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
    })
    .build();

  app.enableCors({
    origin: reactOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(port);
}
bootstrap();
