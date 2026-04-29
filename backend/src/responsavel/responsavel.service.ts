import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Res,
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
      relations: {
        alunos: true,
      },
    });
  }

  async findByUsuarioId(usuarioId: number): Promise<Responsavel | null> {
    const responsavel = await this.responsavelRepository.findOne({
      where: { usuario: { id: usuarioId } },
      //traz os filhos e o histórico de ocorrências
      relations: {
        alunos: {
          ocorrencias: true,
        },
      },
    });
    if (!responsavel) {
      throw new NotFoundException(
        'Perfil de responsável não localizado com esse usuário!',
      );
    }
    return responsavel;
  }

  async update(
    id: number,
    data: Partial<Responsavel>,
    alunoIds?: number[],
  ): Promise<Responsavel | null> {
    try {
      //busca o responsável existente com as relações
      const responsavel = await this.responsavelRepository.findOne({
        where: { id },
        relations: ['alunos'],
      });
      if (!responsavel) {
        throw new NotFoundException('Responsável não localizado');
      }
      //atualização dos dados básicos
      Object.assign(responsavel, {
        nome: data.nome ?? responsavel.nome,
        email: data.email ?? responsavel.email,
        telefone: data.telefone ?? responsavel.telefone,
        cpf: data.cpf ?? responsavel.cpf,
        usuario: data.usuario ?? responsavel.usuario,
      });

      //aqui atualiza os alunos apenas se um array for enviado
      if (alunoIds && alunoIds.length > 0) {
        const alunos = await this.alunoRepository.findBy({
          id: In(alunoIds),
        });
        responsavel.alunos = alunos;
      }
      //.save garante que a tabela many-to-many seja atualizada
      return await this.responsavelRepository.save(responsavel);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
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

      return await this.responsavelRepository.save(newResponsavel);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'Responsável já existe no sistema com as informações fornecidas!',
        );
      }
      throw new BadRequestException('Erro ao criar o responsável.');
    }
  }
}
