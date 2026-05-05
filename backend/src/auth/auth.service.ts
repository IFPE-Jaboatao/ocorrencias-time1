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

  // Função que valida se o e-mail existe e se a senha bate
  async validateUser(email: string, senhaDigitada: string): Promise<any> {
    const usuario = await this.userRepository.findOneBy({ email });

    if (usuario) {
      // Compara a senha que veio do Swagger com a senha criptografada do Banco
      const senhaConfere = await bcrypt.compare(senhaDigitada, usuario.senha);
      if (senhaConfere) {
        // Remove a senha do objeto antes de retornar para não vazar dado sensível
        const { senha, ...result } = usuario;
        return result;
      }
    }
    return null; // Se não achar usuário ou senha não bater
  }

  // Gera o token JWT
  async login(user: any) {
    console.log('Dados do usuário no AuthService:', user);
    const payload = { sub: user.id, funcao: user.funcao };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Registra novos usuários (Admin usa isso)
  async register(senha: string, email: string, funcao: Funcao) {
    const userExists = await this.userRepository.findOne({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('Já existe um usuário com este email.');
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(senha, 10);
    const user = this.userRepository.create({
      email,
      senha: hashedPassword,
      funcao,
      status: false, // Começa como falso até o primeiro acesso/vínculo
    });

    return await this.userRepository.save(user);
  }
}
