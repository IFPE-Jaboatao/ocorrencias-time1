import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OcorrenciaService } from '../ocorrencia/ocorrencia.service';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FuncoesGuard } from 'src/auth/funcoes.guard';
import { Funcoes } from 'src/auth/funcoes.decorator';
import { AlunoService } from './aluno.service';
import { Funcao } from 'src/auth/enums/funcao-usuario.enum';

@Controller('aluno')
export class AlunoController {
  constructor(
    private readonly ocorrenciaService: OcorrenciaService,
    private readonly alunoService: AlunoService,
  ) {}

  @Get('ocorrencias')
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(Funcao.ALUNO)
  async listarMinhasOcorrencias(@Req() req: any) {
    const usuario_id = req.user.sub;
    const aluno = await this.alunoService.findByUsuarioId(usuario_id);
    return this.ocorrenciaService.findAllByAluno(aluno.id);
  }
}
