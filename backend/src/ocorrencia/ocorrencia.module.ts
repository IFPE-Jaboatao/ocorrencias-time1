import { Module } from '@nestjs/common';
import { OcorrenciaService } from './ocorrencia.service';
import { Ocorrencia } from './ocorrencia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Ocorrencia])],
  providers: [OcorrenciaService],
})
export class OcorrenciaModule {}
