import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
