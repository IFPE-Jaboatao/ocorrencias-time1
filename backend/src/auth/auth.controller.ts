import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/createUsuario.dto';
import { Funcao } from './enums/funcaoUsuario.enum';
import { JwtAuthGuard } from './jwt/guards/jwt-auth.guard';
import { Funcoes } from './jwt/decorators/funcoes.decorator';
import { FuncoesGuard } from './jwt/guards/funcoes.guard';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegistrationService } from './registration.service';

@ApiTags('Autenticação e registro')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly registrationService: RegistrationService,
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
  @ApiBearerAuth('token')
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
    await this.registrationService.validarDadosEspecificos(body); // validação

    // Usuário base do login, senha, email e tipo
    const novoUsuario = await this.authService.register(
      body.senha,
      body.email,
      body.funcao,
      body.cpf,
      body.nome,
    );

    await this.registrationService.criarPerfilEspecifico(body, novoUsuario);

    return {
      message: 'Usuário e perfil criados com sucesso',
      userId: novoUsuario.id,
    };
  }
}
