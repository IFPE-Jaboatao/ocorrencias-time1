import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aluno } from './aluno.entity';

@Injectable()
export class AlunoService {
  constructor(
    @InjectRepository(Aluno)
    private readonly alunoRepository: Repository<Aluno>,
  ) {}

  async findAll(): Promise<Aluno[]> {
    return this.alunoRepository.find();
  }

  async findOne(id: number): Promise<Aluno | null> {
    return this.alunoRepository.findOneBy({ id });
  }

  async findByUsuarioId(usuarioId: number): Promise<Aluno | null> {
    return this.alunoRepository.findOneBy({ usuario: { id: usuarioId } });
  }

  async create(aluno: Partial<Aluno>): Promise<Aluno> {
    try {
      const newAluno = this.alunoRepository.create(aluno);
      return await this.alunoRepository.save(newAluno);
    } catch (error) {
      if ((error as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Aluno já existe');
      }

      throw new BadRequestException('Erro ao criar aluno');
    }
  }

  async update(aluno: Partial<Aluno>): Promise<Aluno | null> {
    return await this.alunoRepository.save(aluno);
  }
}
