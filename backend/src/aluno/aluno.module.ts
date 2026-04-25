import { forwardRef, Module } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aluno } from './aluno.entity';

import { AlunoController } from './aluno.controller';
import { OcorrenciaModule } from '../ocorrencia/ocorrencia.module';

import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Aluno]),
    forwardRef(() => OcorrenciaModule), // Evita dependência circular
    forwardRef(() => forwardRef(() => AuthModule)), // Evita dependência circular
  ],
  controllers: [AlunoController],
  providers: [AlunoService],
  exports: [AlunoService],
})
export class AlunoModule {}
