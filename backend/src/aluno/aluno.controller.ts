import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OcorrenciaService } from '../ocorrencia/ocorrencia.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FuncoesGuard } from 'src/auth/funcoes.guard';
import { Funcoes } from 'src/auth/funcoes.decorator';
import { AlunoService } from './aluno.service';
import { Funcao } from 'src/auth/enums/funcaoUsuario.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Aluno')
@Controller('aluno')
export class AlunoController {
  constructor(
    private readonly ocorrenciaService: OcorrenciaService,
    private readonly alunoService: AlunoService,
  ) {}

  @Get('ocorrencias')
  @ApiOperation({
    summary:
      'Listar ocorrências vinculadas a um aluno (restrito a usuários com perfil ALUNO).',
  })
  @ApiBearerAuth('token')
  @ApiResponse({
    status: 200,
    description: 'Lista de ocorrências do aluno retornada com sucesso.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado. Token JWT ausente ou inválido.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Proibido. O usuário não tem perfil de aluno para acessar este recurso.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor ao processar a solicitação.',
  })
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(Funcao.ALUNO)
  async listarMinhasOcorrencias(@Req() req: any) {
    const usuarioId = req.user.sub;
    const aluno = await this.alunoService.findByUsuarioId(usuarioId);
    return this.ocorrenciaService.findAllByAluno(aluno.id);
  }
}
