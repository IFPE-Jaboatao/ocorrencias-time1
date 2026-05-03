import { Controller, Post, Body, UseGuards, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-usuario.dto';
import { Funcao } from './enums/funcao-usuario.enum';
import { ResponsavelService } from 'src/responsavel/responsavel.service';
import { AlunoService } from 'src/aluno/aluno.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Funcoes } from './funcoes.decorator';
import { FuncoesGuard } from './funcoes.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly alunoService: AlunoService,
    private readonly responsavelService: ResponsavelService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.senha);
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard, FuncoesGuard)
  @Funcoes(Funcao.ADMIN)
  @Post('register')
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
