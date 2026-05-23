import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  BadRequestException,
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
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VincularAlunoResponsavelDto } from './dto/vincular-aluno-responsavel.dto';
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
  @ApiResponse({
    status: 200,
    description:
      'Autenticação bem-sucedida. Token JWT retornado no cookie HttpOnly.',
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
    return await this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(Funcao.ADMIN)
  @Post('register')
  @ApiOperation({
    summary:
      'Registrar um novo usuário com perfil específico (restrito a usuários com perfil ADMIN).',
  })
  @ApiCookieAuth('token')
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
    if (body.funcao == Funcao.RESPONSAVEL) {
      function validarCPFFormato(cpf) {
        const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        return regex.test(cpf);
      }
      function validarTelefoneFormato(telefone) {
        const regex = /^\(\d{2}\) \d{5}-\d{4}$/;
        return regex.test(telefone);
      }
      if (!validarCPFFormato(body.cpf)) {
        throw new BadRequestException(
          'CPF inválido. O formato deve ser XXX.XXX.XXX-XX',
        );
      }
      if (body.telefone && !validarTelefoneFormato(body.telefone)) {
        throw new BadRequestException(
          'Telefone inválido. O formato deve ser (XX) XXXXX-XXXX',
        );
      }
      const existCpf = await this.responsavelService.findByCpf(body.cpf);
      if (existCpf) {
        throw new ConflictException(
          'CPF já cadastrado para outro responsável.',
        );
      }
      const existTelefone = await this.responsavelService.findByTelefone(
        body.telefone,
      );
      if (existTelefone) {
        throw new ConflictException(
          'Telefone já cadastrado para outro responsável.',
        );
      }
    } else if (body.funcao == Funcao.ALUNO) {
      const existmatricula = await this.alunoService.findByMatricula(
        body.matricula,
      );
      if (existmatricula) {
        throw new ConflictException(
          'Matrícula já cadastrada para outro aluno.',
        );
      }
    }

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
  @ApiOperation({
    summary:
      'Vincular um aluno a um responsável existente (restrito a usuários com perfil ADMIN).',
  })
  @ApiCookieAuth('token')
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
    status: 404,
    description: 'Aluno ou responsável não encontrado para os IDs fornecidos.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor durante o vínculo.',
  })
  async vincularAlunoResponsavel(
    @Body()
    body: VincularAlunoResponsavelDto,
  ) {
    const aluno = await this.alunoService.findByUsuarioId(body.alunoId);
    const responsavel = await this.responsavelService.findOneById(
      body.responsavelId,
    );

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado');
    }
    if (!responsavel) {
      throw new NotFoundException('Responsável não encontrado');
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
