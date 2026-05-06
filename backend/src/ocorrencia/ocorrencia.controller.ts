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
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { OcorrenciaService } from './ocorrencia.service';
import { CreateOcorrenciaDto } from './create-ocorrencia.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FuncoesGuard } from 'src/auth/funcoes.guard';
import { Funcoes } from 'src/auth/funcoes.decorator';
import { Funcao } from 'src/auth/enums/funcao-usuario.enum';
import { AtualizarStatusDto } from './dto/atualizar-status.dto';
import { StatusOcorrencia, Severidade } from './ocorrencia.entity';
import { ListarOcorrenciaDto } from './dto/listar-ocorrencia.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Ocorrências')
@Controller('ocorrencias')
//adicionada 'blindagem' global do controller
@UseGuards(JwtAuthGuard, FuncoesGuard)
@ApiBearerAuth()
export class OcorrenciaController {
  constructor(private readonly ocorrenciaService: OcorrenciaService) {}

  @Funcoes(Funcao.ADMIN, Funcao.PROFESSOR)
  @Get()
  @ApiOperation({ summary: 'Listar ocorrências com filtros opcionais' })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'id_aluno',
    required: false,
    description: 'ID do aluno para filtrar ocorrências por aluno específico',
  })
  //atualizado status da ocorrência como múltipla escolha para eliminar chance de erros de digitação
  @ApiQuery({
    name: 'status',
    description: 'Status da ocorrência para filtragem',
    required: false,
    enum: StatusOcorrencia,
    schema: {
      default: StatusOcorrencia.ABERTA,
    },
  })
  @ApiQuery({
    name: 'severidade',
    required: false,
    description:
      'Severidade da ocorrência (baixa, média, alta) para filtrar por gravidade',
    enum: Severidade,
    schema: {
      default: Severidade.BAIXA,
    },
  })
  @ApiQuery({
    name: 'data',
    required: false,
    description:
      'Data de criação da ocorrência para filtrar por data (formato AAAA-MM-DD)',
  })
  @ApiQuery({
    name: 'turma',
    required: false,
    description: 'Turma do aluno para filtrar ocorrências por turma',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página para paginação (padrão: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número de itens por página para paginação (padrão: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ocorrências encontradas',
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros de filtro inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado. Token JWT ausente ou inválido.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Proibido. O usuário não tem perfil de ADMIN ou PROFESSOR para acessar este recurso.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor.',
  })
  async findAll(@Query() filtros: ListarOcorrenciaDto) {
    return await this.ocorrenciaService.findAll(filtros);
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova ocorrência' })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'Authorization',
    required: true,
    description: 'Token JWT de autenticação e autorização do usuário',
  })
  @ApiResponse({
    status: 201,
    description: 'Ocorrência criada com sucesso.',
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
      'Proibido. O usuário não tem perfil de ADMIN ou PROFESSOR para acessar este recurso.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor.',
  })
  @Funcoes(Funcao.ADMIN, Funcao.PROFESSOR)
  async create(@Body() dto: CreateOcorrenciaDto, @Req() req: any) {
    console.log('Payload do JWT:', req.user);

    const autorId = req.user?.sub || req.user?.id || req.user?.userId;

    if (!autorId) {
      throw new BadRequestException(
        'Não foi possível extrair o ID do usuário do token.',
      );
    }

    return await this.ocorrenciaService.create(dto, autorId);
  }

  @Get('admin/recentes')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar ocorrências recentes para o dashboard do admin',
  })
  @ApiQuery({
    name: 'Authorization',
    required: true,
    description: 'Token JWT de autenticação e autorização do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ocorrências recentes retornada com sucesso.',
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
  @Funcoes(Funcao.ADMIN)
  async findRecentes() {
    return await this.ocorrenciaService.findRecentes();
  }

  @Get('admin/dashboard')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter métricas para o dashboard do admin' })
  @ApiQuery({
    name: 'Authorization',
    required: true,
    description: 'Token JWT de autenticação e autorização do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Métricas do dashboard retornadas com sucesso.',
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
  @Funcoes(Funcao.ADMIN)
  async getDashboard() {
    return await this.ocorrenciaService.getDashboardMetrics();
  }

  @Post(':id/ciencia')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Registrar ciência de uma ocorrência por aluno ou responsável',
  })
  @ApiQuery({
    name: 'Authorization',
    required: true,
    description: 'Token JWT de autenticação e autorização do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Ciência registrada com sucesso.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado. Token JWT ausente ou inválido.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Proibido. O usuário não tem perfil de ALUNO ou RESPONSAVEL para acessar este recurso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ocorrência não encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor.',
  })
  @Funcoes(Funcao.ALUNO, Funcao.RESPONSAVEL)
  //alterado de string para number
  async registrarCiencia(@Param('id', ParseIntPipe) id: number) {
    return await this.ocorrenciaService.registrarCiencia(id);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar o status de uma ocorrência' })
  @ApiQuery({
    name: 'Authorization',
    required: true,
    description: 'Token JWT de autenticação e autorização do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Status da ocorrência atualizado com sucesso.',
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
      'Proibido. O usuário não tem perfil de ADMIN ou PROFESSOR para acessar este recurso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ocorrência não encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor.',
  })
  @Funcoes(Funcao.ADMIN, Funcao.PROFESSOR)
  async atualizarStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarStatusDto,
  ) {
    return await this.ocorrenciaService.atualizarStatus(id, dto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter detalhes de uma ocorrência por ID' })
  @ApiQuery({
    name: 'Authorization',
    required: true,
    description: 'Token JWT de autenticação e autorização do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da ocorrência retornados com sucesso.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado. Token JWT ausente ou inválido.',
  })
  @ApiResponse({
    status: 404,
    description: 'Ocorrência não encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor.',
  })
  async getOcorrencia(@Param('id', ParseIntPipe) id: number) {
    //parseintpipe garante que o id é um número antes de cair no return
    return await this.ocorrenciaService.findOne(id);
  }
}
