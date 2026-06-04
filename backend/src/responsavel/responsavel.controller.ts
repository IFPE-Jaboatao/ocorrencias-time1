import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ResponsavelService } from './responsavel.service';
import { JwtAuthGuard } from '../auth/jwt/guards/jwt-auth.guard';
import { FuncoesGuard } from '../auth/jwt/guards/funcoes.guard';
import { Funcoes } from '../auth/jwt/decorators/funcoes.decorator';
import { Funcao } from '../auth/enums/funcaoUsuario.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VinculoService } from './vinculo.service';
import { AlunoService } from 'src/aluno/aluno.service';

@ApiTags('Responsável')
@Controller('responsavel')
export class ResponsavelController {
  constructor(
    private readonly responsavelService: ResponsavelService,
    private readonly vinculoService: VinculoService,
    private readonly alunoService: AlunoService,
  ) {}

  @Get('alunos')
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
  @Funcoes(Funcao.RESPONSAVEL)
  async listarAlunosVinculados(@Req() req: any) {
    const usuarioId = req.user.sub;
    const responsavel =
      await this.responsavelService.findByUsuarioId(usuarioId);
    const alunos = [];
    for (const aluno of responsavel.alunos) {
      await this.alunoService.findOneById(aluno.id).then((alunoCompleto) => {
        if (alunoCompleto) {
          alunos.push(alunoCompleto);
        }
      });
    }
    return { alunos };
  }

  @Post(':responsavelId/aluno/:alunoId')
  @ApiOperation({
    summary:
      'Vincular responsável a um aluno  (restrito a usuários com perfil ADMIN).',
  })
  @ApiParam({
    name: 'responsavelId',
    description: 'ID do responsável a ser vinculado ao aluno.',
    required: true,
    example: 1,
    type: Number,
  })
  @ApiParam({
    name: 'alunoId',
    description: 'ID do aluno a ser vinculado ao responsável.',
    required: true,
    example: 1,
    type: Number,
  })
  @ApiBearerAuth('token')
  @ApiResponse({
    status: 200,
    description: 'Responsável vinculado ao aluno com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Requisição inválida. Verifique os dados fornecidos.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado. Token JWT ausente ou inválido.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Proibido. O usuário não tem perfil de ADMIN para acessar este recurso.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor.',
  })
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(Funcao.ADMIN)
  async vincularResponsavelAluno(
    @Param('responsavelId', ParseIntPipe) responsavelId: number,
    @Param('alunoId', ParseIntPipe) alunoId: number,
  ) {
    return await this.vinculoService.vincular(responsavelId, alunoId);
  }
}
