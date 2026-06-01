import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turma } from './turma.entity';
import { TurmaService } from './turma.service';

@Module({
  imports: [TypeOrmModule.forFeature([Turma])],
  controllers: [],
  providers: [TurmaService],
  exports: [TurmaService],
})
export class TurmaModule {}
