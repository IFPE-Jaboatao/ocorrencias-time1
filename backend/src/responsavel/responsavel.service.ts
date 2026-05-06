import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findByTelefone(telefone: string) {
    return this.responsavelRepository.findOne({
      where: { telefone },
      relations: {
        alunos: true,
      },
    });
  }
  //alterado o nome para ficar alinhado com o controller
  async findFilhos(usuarioId: number): Promise<Responsavel | null> {
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
    novo_email_responsavel?: string,
  ): Promise<Responsavel | null> {
    try {
      //busca o responsável existente com as relações
      const responsavel = await this.responsavelRepository.findOne({
        where: { id },
        relations: ['usuario'],
      });
      if (!responsavel) {
        throw new NotFoundException('Responsável não localizado');
      }

      if (novo_email_responsavel && responsavel.usuario) {
        const emailCount = await this.responsavelRepository.count({
          where: { usuario: { email: novo_email_responsavel } },
        });
        if (
          emailCount > 0 &&
          responsavel.usuario.email !== novo_email_responsavel
        ) {
          throw new ConflictException(
            'Já existe um responsável com este email.',
          );
        }
        responsavel.usuario.email = novo_email_responsavel;
      }

      //atualização dos dados básicos
      Object.assign(responsavel, {
        nome: data.nome ?? responsavel.nome,
        telefone: data.telefone ?? responsavel.telefone,
        cpf: data.cpf ?? responsavel.cpf,
      });
      //.save garante que a tabela many-to-many seja atualizada
      return await this.responsavelRepository.save(responsavel);
    } catch (error) {
      console.error('Erro no update de responsável:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      )
        throw error;
      throw new BadRequestException('Erro ao atualizar responsável');
    }
  }

  async create(data: Partial<Responsavel>): Promise<Responsavel> {
    try {
      const newResponsavel = this.responsavelRepository.create({
        nome: data.nome,
        telefone: data.telefone,
        cpf: data.cpf,
        usuario: data.usuario?.id ? { id: data.usuario.id } : undefined,
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
