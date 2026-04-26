import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FuncoesGuard } from '../auth/funcoes.guard';
import { Funcoes } from '../auth/funcoes.decorator';
import { Funcao } from '../auth/enums/funcao-usuario.enum';

@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Get('meus-alunos')
  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(Funcao.PROFESSOR) // Apenas professores logados entram
  async listarMeusAlunos(@Req() req: any) {
    // aqui pega o id do usuario logado
    const usuario_id = req.user.sub;
    // aqui busca o professor e lista de alunos associados
    const professor = await this.professorService.findByUsuarioId(usuario_id);
    // aqui retorna apenas o array de alunos
    return professor.alunos;
  }
}
