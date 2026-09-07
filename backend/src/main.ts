import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  
  app.enableCors({
    origin: [
      'http://localhost',
      'http://localhost:80',
      'http://localhost:4200',
      'http://127.0.0.1',
      'http://127.0.0.1:80',
      'http://127.0.0.1:4200',
    ],
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de OpenAPI / Swagger
  const config = new DocumentBuilder()
    .setTitle('TaskFlow API')
    .setDescription('Documentación interactiva de la API REST de TaskFlow para gestión de proyectos y tareas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
  logger.log(`📚 Documentación Swagger disponible en http://localhost:${port}/api/docs`);
}
bootstrap();
