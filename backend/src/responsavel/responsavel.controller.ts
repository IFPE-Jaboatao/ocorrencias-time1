import {
  Controller,
  Get,
  NotFoundException,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ResponsavelService } from './responsavel.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FuncoesGuard } from '../auth/funcoes.guard';
import { Funcoes } from '../auth/funcoes.decorator';
import { Funcao } from '../auth/enums/funcao-usuario.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Responsável')
@Controller('responsavel')
@UseGuards(JwtAuthGuard, FuncoesGuard)
export class ResponsavelController {
  constructor(private readonly responsavelService: ResponsavelService) {}

  @Get('filhos')
  @ApiOperation({ summary: 'Listar alunos vinculados ao responsável logado' })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'Authorization',
    required: true,
    description: 'Token JWT de autenticação e autorização do usuário',
  })
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
  @Funcoes(Funcao.RESPONSAVEL) //bloqueia alunos, profs e admins
  async listarMeusFilhos(@Req() req: any) {
    //puxa o id do usuário logado
    const usuarioId = req.user?.sub || req.user?.id || req.user?.userId;

    if (!usuarioId) {
      throw new UnauthorizedException(
        'Não foi possível identificar o responsável no token',
      );
    }
    //busca o responsável pelo usuarioId e retorna a lista dos alunos/filhos relacionados
    const responsavel = await this.responsavelService.findFilhos(usuarioId);

    if (!responsavel) {
      throw new NotFoundException('Perfil de responsável não encontrado');
    }

    //retorna a lista de alunos para o front
    return responsavel.alunos || [];
  }
}
