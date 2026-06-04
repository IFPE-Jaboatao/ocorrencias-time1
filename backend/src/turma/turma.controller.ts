import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TurmaService } from './turma.service';
import { FuncoesGuard } from 'src/auth/jwt/guards/funcoes.guard';
import { JwtAuthGuard } from 'src/auth/jwt/guards/jwt-auth.guard';
import { Funcoes } from 'src/auth/jwt/decorators/funcoes.decorator';
import { Funcao } from 'src/auth/enums/funcaoUsuario.enum';
import { TurmaDto } from './dto/createTurma.dto';

@ApiTags('Turma')
@Controller('turma')
@UseGuards(JwtAuthGuard, FuncoesGuard)
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar uma nova turma.',
  })
  @ApiBearerAuth('token')
  @ApiResponse({
    status: 201,
    description: 'Turma criada com sucesso.',
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
    status: 409,
    description: 'Conflito. Já existe uma turma com os mesmos dados.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor.',
  })
  @Funcoes(Funcao.ADMIN)
  async createTurma(@Body() body: TurmaDto) {
    return await this.turmaService.create(body);
  }
}
