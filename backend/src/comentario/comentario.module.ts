import { Module } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { Comentario } from './comentario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Comentario])],
  providers: [ComentarioService],
})
export class ComentarioModule {}
