import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turma } from './turma.entity';
import { Turno } from './enum/turno.enum';

@Injectable()
export class TurmaService {
  constructor(
    @InjectRepository(Turma)
    private readonly turmaRepository: Repository<Turma>,
  ) {}

  async findAll(): Promise<Turma[]> {
    return this.turmaRepository.find();
  }

  async findOneById(id: number): Promise<Turma | null> {
    return this.turmaRepository.findOneBy({ id });
  }

  async findOneBySerie(serie: number): Promise<Turma | null> {
    return this.turmaRepository.findOneBy({ serie });
  }

  async findOneByTurma(turma: string): Promise<Turma | null> {
    return this.turmaRepository.findOneBy({ turma });
  }

  async findOneByTurno(turno: Turno): Promise<Turma | null> {
    return this.turmaRepository.findOneBy({ turno });
  }

  async create(turma: Partial<Turma>): Promise<Turma> {
    const newTurma = this.turmaRepository.create(turma);
    return this.turmaRepository.save(newTurma);
  }

  async update(turma: Partial<Turma>): Promise<Turma | null> {
    await this.turmaRepository.update(turma.id, turma);
    return this.turmaRepository.findOneBy({ id: turma.id });
  }
}
