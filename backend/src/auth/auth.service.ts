import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { Usuario } from '../usuario/usuario.entity';
import { Funcao } from './enums/funcaoUsuario.enum';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, senhaDigitada: string): Promise<any> {
    const usuario = await this.usuarioService.findOneByEmail(email);

    if (usuario) {
      const senhaConfere = await bcrypt.compare(senhaDigitada, usuario.senha);
      if (senhaConfere) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { senha, ...result } = usuario;
        return result;
      }
    }
    return null;
  }

  async login(user: Usuario) {
    const payload = { sub: user.id, nome: user.nome, funcao: user.funcao };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    senha: string,
    email: string,
    funcao: Funcao,
    cpf: string,
    nome: string,
  ) {
    const userExists = await this.usuarioService.findOneByEmail(email);

    if (userExists) {
      throw new ConflictException('Já existe um usuário com este email.');
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    return await this.usuarioService.create({
      email,
      senha: hashedPassword,
      funcao,
      cpf,
      nome,
    });
  }
}
