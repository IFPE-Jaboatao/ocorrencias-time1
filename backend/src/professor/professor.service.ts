import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professor } from './professor.entity';

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
  ) {}

  // encontra o perfil do professor logado & trás a lista de alunos associados
  async findByUsuarioId(usuarioId: number): Promise<Professor> {
    const professor = await this.professorRepository.findOne({
      where: { usuario: { id: usuarioId } },
      relations: ['alunos', 'alunos.ocorrencias'], //aqui retorna os alunos e também o històrcio de ocorrências
    });

    if (!professor) {
      throw new NotFoundException(
        'Perfil de professor não encontrado para este usuário.',
      );
    }

    return professor;
  }

  async create(professor: Partial<Professor>): Promise<Professor> {
    const newProfessor = this.professorRepository.create(professor);
    return this.professorRepository.save(newProfessor);
  }
}
