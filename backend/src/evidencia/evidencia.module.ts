import { Module } from '@nestjs/common';
import { EvidenciaService } from './evidencia.service';
import { EvidenciaController } from './evidencia.controller';
import { Evidencia } from './evidencia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcorrenciaModule } from 'src/ocorrencia/ocorrencia.module';

@Module({
  imports: [TypeOrmModule.forFeature([Evidencia]), OcorrenciaModule],
  controllers: [EvidenciaController],
  providers: [EvidenciaService],
})
export class EvidenciaModule {}
