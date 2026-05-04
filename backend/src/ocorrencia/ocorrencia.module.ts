import { Module } from '@nestjs/common';
import { OcorrenciaService } from './ocorrencia.service';
import { Ocorrencia } from './ocorrencia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcorrenciaController } from './ocorrencia.controller';
import { Aluno } from 'src/aluno/aluno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ocorrencia, Aluno])],
  providers: [OcorrenciaService],
  exports: [OcorrenciaService],
  controllers: [OcorrenciaController],
})
export class OcorrenciaModule {}
