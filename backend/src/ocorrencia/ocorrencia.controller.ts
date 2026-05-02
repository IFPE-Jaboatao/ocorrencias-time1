import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { OcorrenciaService } from './ocorrencia.service';
import { CreateOcorrenciaDto } from './create-ocorrencia.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FuncoesGuard } from 'src/auth/funcoes.guard';
import { Funcoes } from 'src/auth/funcoes.decorator';
import { Funcao } from 'src/auth/enums/funcao-usuario.enum';

@Controller('ocorrencias')
//adicionada 'blindagem' global do controller
@UseGuards(JwtAuthGuard, FuncoesGuard)
export class OcorrenciaController {
  constructor(private readonly ocorrenciaService: OcorrenciaService) {}

  @Post()
  //regra de negócios adicionada
  @Funcoes(Funcao.ADMIN, Funcao.PROFESSOR)
  async create(@Body() dto: CreateOcorrenciaDto, @Req() req: any) {
    const autorId = req.user.sub; //pegamos o ID do usuário logado a partir do token

    return await this.ocorrenciaService.create(dto, autorId);
  }
}
