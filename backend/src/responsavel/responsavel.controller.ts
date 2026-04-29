import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ResponsavelService } from './responsavel.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FuncoesGuard } from '../auth/funcoes.guard';
import { Funcoes } from '../auth/funcoes.decorator';
import { Funcao } from '../auth/enums/funcao-usuario.enum';
@Controller('responsavel')
export class ResponsavelController {
  constructor(private readonly responsavelService: ResponsavelService) {}
  @Get('filhos')
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
