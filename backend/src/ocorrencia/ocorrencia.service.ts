import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ocorrencia, StatusOcorrencia } from './ocorrencia.entity';
import { Aluno } from 'src/aluno/aluno.entity';
import { Usuario } from 'src/auth/usuario.entity';
import { CreateOcorrenciaDto } from './create-ocorrencia.dto';

@Injectable()
export class OcorrenciaService {
  constructor(
    @InjectRepository(Ocorrencia)
    private readonly ocorrenciaRepository: Repository<Ocorrencia>,
    //adicionado o repositório de aluno para validar a existência do aluno
    @InjectRepository(Aluno)
    private readonly alunoRepository: Repository<Aluno>,
  ) {}

  async findAll(): Promise<Ocorrencia[]> {
    return this.ocorrenciaRepository.find({
      relations: ['aluno', 'autor', 'evidencias', 'comentarios'],
    });
  }

  async findRecentes(): Promise<Ocorrencia[]> {
    return this.ocorrenciaRepository.find({
      order: {
        data_criacao: 'DESC',
      },
      take: 5,
      relations: {
        aluno: true,
        autor: true,
      },
    });
  }
  async getDashboardMetrics() {
    //conta o total de ocorrências
    const total = await this.ocorrenciaRepository.count();

    //contagem das ocorrencias pendentes
    const pendentes = await this.ocorrenciaRepository.count({
      where: { status: StatusOcorrencia.ABERTA },
    });

    //contagem das ocorrências que foram resolvidas
    const resolvidas = await this.ocorrenciaRepository.count({
      where: { status: StatusOcorrencia.RESOLVIDA },
    });

    //cálculo da taxa de resolução
    const taxaResolucao =
      total > 0 ? ((resolvidas / total) * 100).toFixed(2) + '%' : '0.00%';

    return {
      total,
      pendentes,
      resolvidas,
      taxaResolucao,
    };
  }
  async findAllByAluno(alunoId: number): Promise<Ocorrencia[]> {
    return this.ocorrenciaRepository.find({
      where: { aluno: { id: alunoId } },
      relations: ['aluno', 'autor', 'evidencias', 'comentarios'],
    });
  }

  async findOne(id: number): Promise<Ocorrencia | null> {
    return this.ocorrenciaRepository.findOne({
      where: { id },
      relations: ['aluno', 'autor', 'evidencias', 'comentarios'],
    });
  }
  //alteração ---> usamos agora o dto validado e recebemos o token do jwt
  async create(
    CreateOcorrenciaDto: CreateOcorrenciaDto,
    autorId: number,
  ): Promise<Ocorrencia> {
    //adicionada a verificação de existência do aluno
    const aluno = await this.alunoRepository.findOne({
      where: { id: CreateOcorrenciaDto.alunoId },
    });

    if (!aluno) {
      throw new NotFoundException(
        `Aluno com ID ${CreateOcorrenciaDto.alunoId} não encontrado no sistema`,
      );
    }
    //adicionada 'preparação da entidade com os dados filtrados e validados pelo dto
    const novaOcorrencia = this.ocorrenciaRepository.create({
      categoria: CreateOcorrenciaDto.categoria,
      severidade: CreateOcorrenciaDto.severidade,
      descricao: CreateOcorrenciaDto.descricao,
      contexto: CreateOcorrenciaDto.contexto,
    });
    //adicionada vinculação do aluno encontrado e o autor pelo jwt
    novaOcorrencia.aluno = aluno; //associamos o aluno encontrado à ocorrência
    novaOcorrencia.autor = { id: autorId } as Usuario; //associamos o autor (usuário logado) à ocorrência usando o ID do token
    //aqui a ocorrência é salva no banco de dados
    return this.ocorrenciaRepository.save(novaOcorrencia);
  }

  async update(ocorrencia: Partial<Ocorrencia>): Promise<Ocorrencia | null> {
    await this.ocorrenciaRepository.update(ocorrencia.id, ocorrencia);
    return this.ocorrenciaRepository.findOneBy({ id: ocorrencia.id });
  }
}
