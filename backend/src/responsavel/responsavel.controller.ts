import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ResponsavelService } from './responsavel.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FuncoesGuard } from '../auth/funcoes.guard';
import { Funcoes } from '../auth/funcoes.decorator';
import { Funcao } from '../auth/enums/funcaoUsuario.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Responsável')
@Controller('responsavel')
export class ResponsavelController {
  constructor(private readonly responsavelService: ResponsavelService) {}
  @Get('filhos')
  @ApiOperation({
    summary:
      'Listar alunos vinculados ao responsável logado (restrito a usuários com perfil RESPONSÁVEL)',
  })
  @ApiBearerAuth('token')
  @ApiResponse({
    status: 200,
    description: 'Lista de alunos retornada com sucesso.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado. Token JWT ausente ou inválido.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Proibido. O usuário não tem perfil de responsável para acessar este recurso.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor.',
  })
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(Funcao.RESPONSAVEL) //bloqueia alunos, profs e admins
  async listarMeusFilhos(@Req() req: any) {
    //puxa o id do usuário logado
    const usuarioId = req.user.sub;
    //busca o responsável pelo usuarioId e retorna a lista dos alunos/filhos relacionados
    const responsavel =
      await this.responsavelService.findByUsuarioId(usuarioId);
    //retorna a lista de alunos para o front
    return responsavel.alunos;
  }
}
