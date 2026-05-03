import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//adicionada importação do ValidationPipe para ativar a validação dos DTOs

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //adicionado o global pipe para 'ativação do DTO' e validação de dados Que vão entrar'
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
