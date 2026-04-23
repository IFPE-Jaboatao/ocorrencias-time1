import { Module } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aluno } from './aluno.entity';

import { AlunoController } from './aluno.controller';
import { OcorrenciaModule } from '../ocorrencia/ocorrencia.module';
@Module({
  imports: [TypeOrmModule.forFeature([Aluno])],
  controllers: [AlunoController],
  providers: [AlunoService],
  exports: [AlunoService],
  modules: [OcorrenciaModule],
})
export class AlunoModule {}
