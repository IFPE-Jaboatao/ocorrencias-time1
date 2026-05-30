import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessorService } from './professor.service';
import { Professor } from './professor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Professor])],
  controllers: [],
  providers: [ProfessorService],
  exports: [ProfessorService],
})
export class ProfessorModule {}
