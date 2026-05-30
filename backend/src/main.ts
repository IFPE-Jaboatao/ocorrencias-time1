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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT',
        in: 'header',
      },
      'token',
    )
    .addTag('Autenticação e registro', 'Login e registro de usuários')
    .addTag(
      'Ocorrência',
      'Gerenciamento de ocorrências, incluindo criação, listagem e atualização de status',
    )
    .addTag(
      'Evidência',
      'Gerenciamento de evidências relacionadas às ocorrências',
    )
    .addTag(
      'Aluno',
      'Recursos específicos para alunos, como listagem de ocorrências pessoais',
    )
    .addTag(
      'Responsável',
      'Recursos específicos para responsáveis, como listagem de aluno vinculado',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { withCredentials: true },
  });

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
