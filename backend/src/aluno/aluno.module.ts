import { Module } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aluno } from './aluno.entity';

import { AlunoController } from './aluno.controller';
import { OcorrenciaModule } from '../ocorrencia/ocorrencia.module';
@Module({
  imports: [TypeOrmModule.forFeature([Aluno]), OcorrenciaModule],
  controllers: [AlunoController],
  providers: [AlunoService],
  exports: [AlunoService],
})
export class AlunoModule {}
