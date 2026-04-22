import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  async update(
    id: number,
    data: Partial<Responsavel>,
    alunoIds: number[],
  ): Promise<Responsavel | null> {
    try {
      let alunos = [];

      if (alunoIds && alunoIds.length > 0) {
        alunos = await this.alunoRepository.findBy({
          id: In(alunoIds),
        });
      }

      await this.responsavelRepository.update(id, {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        cpf: data.cpf,
        usuario: data.usuario,
        alunos: alunos,
      });

      return this.responsavelRepository.findOneBy({ id });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erro ao atualizar responsável');
    }
  }

  async create(data: Partial<Responsavel>): Promise<Responsavel> {
    try {
      const newResponsavel = this.responsavelRepository.create({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        cpf: data.cpf,
        usuario: data.usuario,
      });

      const save = await this.responsavelRepository.save(newResponsavel);
      return save;
    } catch (error) {
      if ((error as any).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Responsável já existe');
      }

      throw new BadRequestException('Erro ao criar responsável');
    }
  }
}
