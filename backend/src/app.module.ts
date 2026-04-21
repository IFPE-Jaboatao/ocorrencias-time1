import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Usuario } from './model/entity/usuario.entity';
import { Aluno } from './model/entity/aluno.entity';
import { Responsavel } from './model/entity/responsavel.entity';
import { Ocorrencia } from './model/entity/ocorrencia.entity';
import { Comentario } from './model/entity/comentario.entity';
import { Evidencia } from './model/entity/evidencia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Aluno,
      Responsavel,
      Ocorrencia,
      Comentario,
      Evidencia,
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      charset: 'utf8mb4', // Suporte completo a acentos e emojis
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
