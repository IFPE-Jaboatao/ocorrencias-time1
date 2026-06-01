import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { Usuario } from '../usuario/usuario.entity';
import { Funcao } from './enums/funcaoUsuario.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, senhaDigitada: string): Promise<any> {
    const usuario = await this.userRepository.findOneBy({ email });

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
    cpf: number,
    nome: string,
  ) {
    const userExists = await this.userRepository.findOne({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('Já existe um usuário com este email.');
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const user = this.userRepository.create({
      email,
      senha: hashedPassword,
      funcao,
      cpf,
      nome,
    });

    return await this.userRepository.save(user);
  }
}
