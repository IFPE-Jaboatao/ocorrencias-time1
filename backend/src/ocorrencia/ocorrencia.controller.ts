import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Param,
  Query,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { OcorrenciaService } from './ocorrencia.service';
import { CreateOcorrenciaDto } from './dto/createOcorrencia.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FuncoesGuard } from 'src/auth/funcoes.guard';
import { Funcoes } from 'src/auth/funcoes.decorator';
import { Funcao } from 'src/auth/enums/funcaoUsuario.enum';
import { AtualizarStatusDto } from './dto/atualizarStatus.dto';
import { ListarOcorrenciaDto } from './dto/listarOcorrencia.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StatusOcorrencia } from './enum/statusOcorrencia.enum';
import { Severidade } from './enum/severidade.enum';

@ApiTags('Ocorrência')
@Controller('ocorrencias')
@UseGuards(JwtAuthGuard, FuncoesGuard)
export class OcorrenciaController {
  constructor(private readonly ocorrenciaService: OcorrenciaService) {}

  @Post()
  @ApiOperation({
    summary:
      'Criar uma nova ocorrência (restrito a usuários com perfil ADMIN ou PROFESSOR).',
  })
  @ApiBearerAuth('token')
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
    const autorId = req.user?.sub || req.user?.id || req.user?.userId;

    if (!autorId) {
      throw new BadRequestException(
        'Não foi possível extrair o ID do usuário do token.',
      );
    }

    return await this.ocorrenciaService.create(dto, autorId);
  }

  @Get('/:id')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary:
      'Obter detalhes de uma ocorrência por ID (sem restrição de perfil).',
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
  async getOcorrencia(@Param('id') id: string) {
    return await this.ocorrenciaService.findOne(Number(id));
  }

  @Funcoes(Funcao.ADMIN, Funcao.PROFESSOR)
  @Get()
  @ApiOperation({
    summary:
      'Listar ocorrências com filtros opcionais (restrito a usuários com perfil ADMIN ou PROFESSOR).',
  })
  @ApiBearerAuth('token')
  @ApiQuery({
    name: 'alunoId',
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

  @Get('dashboard')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary:
      'Obter métricas e últimas ocorrências para o dashboard do admin (restrito a usuários com perfil ADMIN).',
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

  @Put(':id/ciencia')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary:
      'Registrar ciência de uma ocorrência por aluno ou responsável (restrito a usuários com perfil ALUNO ou RESPONSÁVEL).',
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
  async registrarCiencia(@Param('id') id: string) {
    return await this.ocorrenciaService.registrarCiencia(+id);
  }

  @Put(':id/status')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary:
      'Atualizar o status de uma ocorrência (restrito a usuários com perfil ADMIN ou PROFESSOR).',
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
    @Param('id') id: string,
    @Body() dto: AtualizarStatusDto,
  ) {
    return await this.ocorrenciaService.atualizarStatus(+id, dto);
  }
}
