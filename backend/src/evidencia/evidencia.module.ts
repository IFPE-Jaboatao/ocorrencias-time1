import { Module } from '@nestjs/common';
import { EvidenciaService } from './evidencia.service';
import { Evidencia } from './evidencia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Evidencia])],
  providers: [EvidenciaService],
})
export class EvidenciaModule {}
