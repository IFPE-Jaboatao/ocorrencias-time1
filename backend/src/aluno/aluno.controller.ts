import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OcorrenciaService } from '../ocorrencia/ocorrencia.service';

<<<<<<< HEAD
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FuncoesGuard } from '../auth/funcoes.guard';
import { Funcoes } from '../auth/funcoes.decorator';
=======
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FuncoesGuard } from 'src/auth/funcoes.guard';
import { Funcoes } from 'src/auth/funcoes.decorator';
import { AlunoService } from './aluno.service';
import { Funcao } from 'src/auth/enums/funcao-usuario.enum';
>>>>>>> adc5d1de23450cfff4ee8861c487a462986f7ac1

@Controller('aluno')
export class AlunoController {
  constructor(
    private readonly ocorrenciaService: OcorrenciaService,
    private readonly alunoService: AlunoService,
  ) {}

  @Get('ocorrencias')
  @UseGuards(JwtAuthGuard, FuncoesGuard)
<<<<<<< HEAD
  @Funcoes('ALUNO')
  async listarMinhasOcorrencias(@Req() req: any) {
    const alunoId = req.user.id;
    return this.ocorrenciaService.findAllByAluno(alunoId);
=======
  @Funcoes(Funcao.ALUNO)
  async listarMinhasOcorrencias(@Req() req: any) {
    const usuario_id = req.user.sub;
    const aluno = await this.alunoService.findByUsuarioId(usuario_id);
    return this.ocorrenciaService.findAllByAluno(aluno.id);
>>>>>>> adc5d1de23450cfff4ee8861c487a462986f7ac1
  }
}
