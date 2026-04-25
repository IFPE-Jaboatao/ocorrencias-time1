import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { Professor } from './professor.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Professor]),
    forwardRef(() => AuthModule), // aqui traz o jwwt guard
  ],
  controllers: [ProfessorController],
  providers: [ProfessorService],
  exports: [ProfessorService], // Exporrtação do ocorrenciaservice caso precise validar o professor
})
export class ProfessorModule {}
