import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FuncoesGuard } from '../auth/funcoes.guard';
import { Funcoes } from '../auth/funcoes.decorator';
import { Funcao } from '../auth/enums/funcao-usuario.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Professor')
@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Get('meus-alunos')
  @ApiOperation({
    summary:
      'Listar alunos vinculados ao professor logado (restrito a usuários com perfil PROFESSOR).',
  })
  @ApiBearerAuth('token')
  @ApiResponse({
    status: 200,
    description: 'Lista de alunos retornada com sucesso.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado. Token JWT ausente ou inválido.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Proibido. O usuário não tem perfil de professor para acessar este recurso.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor.',
  })
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
