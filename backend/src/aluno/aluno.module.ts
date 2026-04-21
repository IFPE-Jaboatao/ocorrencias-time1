import { Module } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aluno } from './aluno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aluno])],
  providers: [AlunoService],
})
export class AlunoModule {}
