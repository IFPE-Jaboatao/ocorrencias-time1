import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-usuario.dto';
import { Funcao } from './enums/funcao-usuario.enum';
import { ResponsavelService } from 'src/responsavel/responsavel.service';
import { AlunoService } from 'src/aluno/aluno.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Funcoes } from './funcoes.decorator';
import { FuncoesGuard } from './funcoes.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly alunoService: AlunoService,
    private readonly responsavelService: ResponsavelService,
  ) {}

  @Post('login')
  async login(@Body() body: { login: string; senha: string }) {
    const user = await this.authService.validateUser(body.login, body.senha);
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
      body.login,
      body.senha,
      body.email,
      body.funcao,
    );

    // Criação condicional baseada no tipo do usuário
    if (body.funcao === Funcao.ALUNO) {
      await this.alunoService.create({
        nome: body.nome || body.login,
        matricula: body.login,
        email: body.email,
        turma: body.turma,
        usuario: novoUsuario,
      });
    } else if (body.funcao === Funcao.RESPONSAVEL) {
      await this.responsavelService.create(
        {
          nome: body.nome || body.login,
          email: body.email,
          telefone: body.telefone,
          cpf: body.cpf,
          usuario: novoUsuario,
        },
        body.alunoIds || [],
      );
    }

    return {
      message: 'Usuário e perfil criados com sucesso',
      userId: novoUsuario.id,
    };
  }
}
