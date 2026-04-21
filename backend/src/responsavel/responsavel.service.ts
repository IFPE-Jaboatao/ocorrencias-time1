import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryFailedError, Repository } from 'typeorm';
import { Responsavel } from './responsavel.entity';
import { Aluno } from 'src/aluno/aluno.entity';

@Injectable()
export class ResponsavelService {
  constructor(
    @InjectRepository(Responsavel)
    private readonly responsavelRepository: Repository<Responsavel>,
    @InjectRepository(Aluno)
    private readonly alunoRepository: Repository<Aluno>,
  ) {}

  async findAll(): Promise<Responsavel[]> {
    return this.responsavelRepository.find();
  }

  async findOneById(id: number): Promise<Responsavel | null> {
    return this.responsavelRepository.findOneBy({ id });
  }

  async findByCpf(cpf: string) {
    return this.responsavelRepository.findOne({
      where: { cpf },
      relations: ['alunos'],
    });
  }

  async upsertResponsavel(
    dados: Partial<Responsavel>,
    alunoIds: number[],
  ): Promise<Responsavel> {
    if (!dados.cpf) {
      throw new BadRequestException('CPF é obrigatório');
    }

    try {
      let responsavel = await this.findByCpf(dados.cpf);

      if (responsavel) {
        // Evita update vazio
        if (Object.keys(dados).length > 0) {
          Object.assign(responsavel, dados);
        }
      } else {
        responsavel = this.responsavelRepository.create(dados);
      }

      const responsavelSalvo =
        await this.responsavelRepository.save(responsavel);

      // 🔗 vincular alunos
      if (alunoIds && alunoIds.length > 0) {
        const alunos = await this.alunoRepository.findBy({
          id: In(alunoIds),
        });

        if (alunos.length !== alunoIds.length) {
          throw new NotFoundException(
            'Um ou mais alunos não foram encontrados',
          );
        }

        alunos.forEach((aluno) => {
          aluno.responsavel = responsavelSalvo;
        });

        await this.alunoRepository.save(alunos);
      }

      return responsavelSalvo;
    } catch (error) {
      // erro de duplicidade (MySQL)
      if (error instanceof QueryFailedError) {
        if ((error as any).code === 'ER_DUP_ENTRY') {
          throw new ConflictException('Responsável já existe');
        }
      }

      throw new BadRequestException('Erro ao salvar responsável');
    }
  }
}
