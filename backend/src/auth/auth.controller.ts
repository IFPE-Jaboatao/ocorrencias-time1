import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-usuario.dto';
import { Funcao } from './enums/funcao-usuario.enum';
import { ResponsavelService } from 'src/responsavel/responsavel.service';
import { AlunoService } from 'src/aluno/aluno.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Funcoes } from './funcoes.decorator';
import { FuncoesGuard } from './funcoes.guard';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Autenticação e Registro')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly alunoService: AlunoService,
    private readonly responsavelService: ResponsavelService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário e obter token JWT' })
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'Email do usuário para autenticação',
  })
  @ApiQuery({
    name: 'senha',
    required: true,
    description: 'Senha do usuário para autenticação',
  })
  @ApiResponse({
    status: 200,
    description: 'Autenticação bem-sucedida. Token JWT retornado.',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas. Email ou senha incorretos.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor durante a autenticação.',
  })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.senha);
    if (!user) {
      throw new UnauthorizedException('Email ou Senha incorretos');
    }
    const result = await this.authService.login(user);

    return {
      access_token: result.access_token,
    };
  }

  //@UseGuards(JwtAuthGuard, FuncoesGuard)
  //@Funcoes(Funcao.ADMIN)
  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário com perfil específico' })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'email',
    required: true,
    description: 'Email do usuário para registro',
  })
  @ApiQuery({
    name: 'senha',
    required: true,
    description: 'Senha do usuário para registro',
  })
  @ApiQuery({
    name: 'funcao',
    required: true,
    description:
      'Função do usuário (ALUNO ou RESPONSAVEL) para determinar o tipo de perfil a ser criado',
  })
  @ApiQuery({
    name: 'nome',
    required: false,
    description:
      'Nome do usuário para o perfil (apenas para função ALUNO, RESPONSAVEL e PROFESSOR, opcional)',
  })
  @ApiQuery({
    name: 'turma',
    required: false,
    description: 'Turma do aluno (apenas para função ALUNO, opcional)',
  })
  @ApiQuery({
    name: 'cpf',
    required: false,
    description:
      'CPF do responsável (apenas para função RESPONSAVEL, opcional)',
  })
  @ApiQuery({
    name: 'telefone',
    required: false,
    description:
      'Telefone do responsável (apenas para função RESPONSAVEL, opcional)',
  })
  @ApiQuery({
    name: 'matricula',
    required: false,
    description: 'Matrícula do aluno (apenas para função ALUNO, opcional)',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário e perfil criados com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Requisição inválida. Verifique os dados fornecidos para registro.',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado. Token JWT ausente ou inválido.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Proibido. O usuário não tem perfil de administrador para acessar este recurso.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor durante o registro.',
  })
  async register(
    @Body()
    body: RegisterDto,
  ) {
    // Usuário base do login, senha, email e tipo
    const novoUsuario = await this.authService.register(
      body.senha,
      body.email,
      body.funcao,
    );

    // Criação condicional baseada no tipo do usuário
    if (body.funcao === Funcao.ALUNO) {
      await this.alunoService.create({
        nome: body.nome,
        matricula: body.matricula,
        turma: body.turma,
        usuario: novoUsuario,
      });
    } else if (body.funcao === Funcao.RESPONSAVEL) {
      const existCpf = await this.responsavelService.findByCpf(body.cpf);
      if (existCpf) {
        throw new Error('CPF já cadastrado para outro responsável.');
      }
      const existTelefone = await this.responsavelService.findByTelefone(
        body.telefone,
      );
      if (existTelefone) {
        throw new Error('Telefone já cadastrado para outro responsável.');
      }

      await this.responsavelService.create({
        nome: body.nome,
        telefone: body.telefone,
        cpf: body.cpf,
        usuario: novoUsuario,
      });
    }

    return {
      message: 'Usuário e perfil criados com sucesso',
      userId: novoUsuario.id,
    };
  }

  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(Funcao.ADMIN)
  @Put('admin/vinculo')
  @ApiOperation({ summary: 'Vincular um aluno a um responsável existente' })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'alunoId',
    required: true,
    description: 'ID do aluno a ser vinculado ao responsável',
  })
  @ApiQuery({
    name: 'responsavelId',
    required: true,
    description: 'ID do responsável ao qual o aluno será vinculado',
  })
  @ApiResponse({
    status: 200,
    description: 'Aluno vinculado ao responsável com sucesso.',
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
      'Proibido. O usuário não tem perfil de administrador para acessar este recurso.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor durante o vínculo.',
  })
  async vincularAlunoResponsavel(
    @Body()
    body: {
      alunoId: number;
      responsavelId: number;
    },
  ) {
    const aluno = await this.alunoService.findByUsuarioId(body.alunoId);
    const responsavel = await this.responsavelService.findOneById(
      body.responsavelId,
    );

    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }
    if (!responsavel) {
      throw new Error('Responsável não encontrado');
    }

    if (!aluno.responsaveis) {
      aluno.responsaveis = [];
    }

    if (!responsavel.alunos) {
      responsavel.alunos = [];
    }

    aluno.responsaveis.push(responsavel);
    await this.alunoService.update(aluno);
    responsavel.alunos.push(aluno);
    await this.responsavelService.update(responsavel.id, responsavel);

    return {
      message: 'Aluno vinculado ao responsável com sucesso',
      alunoId: aluno.id,
      responsavelId: responsavel.id,
    };
  }
}
