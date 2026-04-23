import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OcorrenciaService } from '../ocorrencia/ocorrencia.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FuncoesGuard } from '../auth/funcoes.guard';
import { Funcoes } from '../auth/funcoes.decorator';

@Controller('aluno')
export class AlunoController {
  constructor(private readonly ocorrenciaService: OcorrenciaService) {}

  @Get('ocorrencias')
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes('ALUNO')
  async listarMinhasOcorrencias(@Req() req: any) {
    const alunoId = req.user.id;
    return this.ocorrenciaService.findAllByAluno(alunoId);
  }
}
