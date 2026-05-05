import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('IFlow API')
    .setDescription(
      'API responsável pela gestão de ocorrências acadêmicas e disciplinares, permitindo registro, acompanhamento, notificações e auditoria com segurança e transparência.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos extras que não estão no DTO
      forbidNonWhitelisted: true, // Retorna erro 400 se enviarem campos não permitidos
      transform: true, // Converte os dados para os tipos corretos (ex: string para number)
    }),
  );
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);

}
bootstrap();
