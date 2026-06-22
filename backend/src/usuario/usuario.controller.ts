import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';
import { FuncoesGuard } from 'src/auth/jwt/guards/funcoes.guard';
import { Funcoes } from 'src/auth/jwt/decorators/funcoes.decorator';
import { Funcao } from 'src/auth/enums/funcaoUsuario.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuários')
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários (Apenas ADMIN)' })
  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(Funcao.ADMIN)
  async listarTodos() {
    return this.usuarioService.findAll();
  }
}
