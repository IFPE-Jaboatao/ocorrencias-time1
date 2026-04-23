import { forwardRef, Module } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aluno } from './aluno.entity';

import { AlunoController } from './aluno.controller';
import { OcorrenciaModule } from '../ocorrencia/ocorrencia.module';
<<<<<<< HEAD
import { AuthModule } from '../auth/auth.module'; // importação do módul auth
@Module({
  imports: [TypeOrmModule.forFeature([Aluno]), OcorrenciaModule, AuthModule],
=======
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Aluno]),
    forwardRef(() => OcorrenciaModule), // Evita dependência circular
    forwardRef(() => forwardRef(() => AuthModule)), // Evita dependência circular
  ],
>>>>>>> adc5d1de23450cfff4ee8861c487a462986f7ac1
  controllers: [AlunoController],
  providers: [AlunoService],
  exports: [AlunoService],
})
export class AlunoModule {}
