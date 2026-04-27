import { Module } from '@nestjs/common';
import { ResponsavelService } from './responsavel.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Responsavel } from './responsavel.entity';
import { Aluno } from 'src/aluno/aluno.entity';
import { ResponsavelController } from './responsavel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Responsavel, Aluno])],
  providers: [ResponsavelService],
  exports: [ResponsavelService],
  controllers: [ResponsavelController],
})
export class ResponsavelModule {}
