import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from './usuario.entity';
import { Funcao } from './enums/funcao-usuario.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(login: string, senha: string): Promise<any> {
    const usuario = await this.userRepository.findOneBy({ login });

    console.log('Validating user:', login, 'Found user:', usuario);

    if (usuario && (await bcrypt.compare(senha, usuario.senha))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { senha, ...result } = usuario;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { login: user.login, sub: user.id, funcao: user.funcao };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(login: string, senha: string, email: string, funcao: Funcao) {
    const userExists = await this.userRepository.findOne({
      where: [{ login }, { email }],
    });

    if (userExists) {
      throw new ConflictException('Usuário já existe');
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const user = this.userRepository.create({
      email,
      login,
      senha: hashedPassword,
      funcao,
      status: false,
    });
    return await this.userRepository.save(user);
  }
}
