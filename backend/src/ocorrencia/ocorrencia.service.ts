import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ocorrencia } from './ocorrencia.entity';

@Injectable()
export class OcorrenciaService {
  constructor(
    @InjectRepository(Ocorrencia)
    private readonly occurrenceRepository: Repository<Ocorrencia>,
  ) {}

  async findAll(): Promise<Ocorrencia[]> {
    return this.occurrenceRepository.find({
      relations: ['aluno', 'autor', 'evidencias', 'comentarios'],
    });
  }

  async findAllByAluno(alunoId: number): Promise<Ocorrencia[]> {
    return this.occurrenceRepository.find({
      where: { aluno: { id: alunoId } },
      relations: ['aluno', 'autor', 'evidencias', 'comentarios'],
    });
  }

  async findOne(id: number): Promise<Ocorrencia | null> {
    return this.occurrenceRepository.findOne({
      where: { id },
      relations: ['aluno', 'autor', 'evidencias', 'comentarios'],
    });
  }

  async create(ocorrencia: Partial<Ocorrencia>): Promise<Ocorrencia> {
    const newOcorrencia = this.occurrenceRepository.create(ocorrencia);
    return this.occurrenceRepository.save(newOcorrencia);
  }

  async update(ocorrencia: Partial<Ocorrencia>): Promise<Ocorrencia | null> {
    await this.occurrenceRepository.update(ocorrencia.id, ocorrencia);
    return this.occurrenceRepository.findOneBy({ id: ocorrencia.id });
  }
}
