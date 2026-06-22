import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { RegisterDto } from 'src/auth/dto/createUsuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findOneById(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOneBy({ id });
  }

  async findOneByCPF(cpf: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOneBy({ cpf });
  }

  async findOneByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOneBy({ email });
  }

  async create(usuario: RegisterDto): Promise<Usuario> {
    const findOneByEmail = await this.usuarioRepository.findOneBy({
      email: usuario.email,
    });
    if (findOneByEmail) {
      throw new ConflictException(
        'Email vinculado a um usuário existente. Escolha outro email para cadastro.',
      );
    }
    const newUsuario = this.usuarioRepository.create(usuario);
    return this.usuarioRepository.save(newUsuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }
}
