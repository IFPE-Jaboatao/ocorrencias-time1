import { Module } from '@nestjs/common';
import { ResponsavelService } from './responsavel.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Responsavel } from './responsavel.entity';
import { Aluno } from 'src/aluno/aluno.entity';
import { ResponsavelController } from './responsavel.controller';
import { VinculoService } from './vinculo.service';
import { AlunoModule } from 'src/aluno/aluno.module';

@Module({
  imports: [TypeOrmModule.forFeature([Responsavel, Aluno]), AlunoModule],
  providers: [ResponsavelService, VinculoService],
  exports: [ResponsavelService],
  controllers: [ResponsavelController],
})
export class ResponsavelModule {}
