import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Req,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { OcorrenciaService } from './ocorrencia.service';
import { CreateOcorrenciaDto } from './create-ocorrencia.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FuncoesGuard } from 'src/auth/funcoes.guard';
import { Funcoes } from 'src/auth/funcoes.decorator';
import { Funcao } from 'src/auth/enums/funcao-usuario.enum';
import { AtualizarStatusDto } from './dto/atualizar-status.dto';
import { ListarOcorrenciaDto } from './dto/listar-ocorrencia.dto';

@Controller('ocorrencias')
//adicionada 'blindagem' global do controller
@UseGuards(JwtAuthGuard, FuncoesGuard)
export class OcorrenciaController {
  constructor(private readonly ocorrenciaService: OcorrenciaService) {}

  @Get()
  @Funcoes(Funcao.ADMIN, Funcao.PROFESSOR)
  async findAll(@Query() filtros: ListarOcorrenciaDto) {
    return await this.ocorrenciaService.findAll(filtros);
  }
  @Post()
  //regra de negócios adicionada
  @Funcoes(Funcao.ADMIN, Funcao.PROFESSOR)
  async create(@Body() dto: CreateOcorrenciaDto, @Req() req: any) {
    const autorId = req.user.sub; //pegamos o ID do usuário logado a partir do token

    return await this.ocorrenciaService.create(dto, autorId);
  }
  //adicionado a conexão para listar as ocorrências recentes para o admin
  @Get('admin/recentes')
  @Funcoes(Funcao.ADMIN)
  async findRecentes() {
    return await this.ocorrenciaService.findRecentes();
  }
  //adicionada a conexão para chamar as métricas de ocorrência do dashboard
  @Get('admin/dashboard')
  @Funcoes(Funcao.ADMIN)
  async getDashboard() {
    return await this.ocorrenciaService.getDashboardMetrics();
  }
  //adicionado o post do ciência do aluno/responsável
  @Post(':id/ciencia')
  @Funcoes(Funcao.ALUNO, Funcao.RESPONSAVEL) //apenas aluno e responsável tem acesso
  async registrarCiencia(@Param('id') id: string) {
    return await this.ocorrenciaService.registrarCiencia(+id);
    //o + antes do id converte a string para número
  }
  @Patch(':id/status')
  @Funcoes(Funcao.ADMIN, Funcao.PROFESSOR)
  async atualizarStatus(
    @Param('id') id: string,
    @Body() dto: AtualizarStatusDto,
  ) {
    return await this.ocorrenciaService.atualizarStatus(+id, dto);
  }
}
