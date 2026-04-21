import { Injectable } from '@nestjs/common';
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

  async create(aluno: Partial<Aluno>): Promise<Aluno> {
    const newAluno = this.alunoRepository.create(aluno);
    return this.alunoRepository.save(newAluno);
  }

  async update(aluno: Partial<Aluno>): Promise<Aluno | null> {
    await this.alunoRepository.update(aluno.id, aluno);
    return this.alunoRepository.findOneBy({ id: aluno.id });
  }
}
