import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AlunoModule } from './aluno/aluno.module';
import { OcorrenciaModule } from './ocorrencia/ocorrencia.module';
import { ResponsavelModule } from './responsavel/responsavel.module';
import { ProfessorModule } from './professor/professor.module';
import { EvidenciaModule } from './evidencia/evidencia.module';
import { ComentarioModule } from './comentario/comentario.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      charset: 'utf8mb4',
      autoLoadEntities: true,
      synchronize: true,
      migrations: [],
      subscribers: [],
    }),
    AuthModule,
    ProfessorModule,
    EvidenciaModule,
    AlunoModule,
    OcorrenciaModule,
    ResponsavelModule,
    ComentarioModule,
  ],
})
export class AppModule {}
