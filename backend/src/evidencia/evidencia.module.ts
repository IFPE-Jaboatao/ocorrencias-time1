import { Module } from '@nestjs/common';
import { EvidenciaService } from './evidencia.service';
import { EvidenciaController } from './evidencia.controller';
import { Evidencia } from './evidencia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Evidencia])],
  controllers: [EvidenciaController],
  providers: [EvidenciaService],
})
export class EvidenciaModule {}
