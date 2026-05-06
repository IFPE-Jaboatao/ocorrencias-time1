import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ocorrencia, StatusOcorrencia } from './ocorrencia.entity';
import { Aluno } from 'src/aluno/aluno.entity';
import { CreateOcorrenciaDto } from './create-ocorrencia.dto';
import { ListarOcorrenciaDto } from './dto/listar-ocorrencia.dto';
import { BadRequestException } from '@nestjs/common';
import { AtualizarStatusDto } from './dto/atualizar-status.dto';
@Injectable()
export class OcorrenciaService {
  constructor(
    @InjectRepository(Ocorrencia)
    private readonly ocorrenciaRepository: Repository<Ocorrencia>,
    //adicionado o repositório de aluno para validar a existência do aluno
    @InjectRepository(Aluno)
    private readonly alunoRepository: Repository<Aluno>,
  ) {}

  async findAll(filtros: ListarOcorrenciaDto) {
    const {
      status,
      id_aluno,
      data,
      turma,
      severidade,
      descricao,
      page = 1,
      limit = 10,
    } = filtros;

    const qb = this.ocorrenciaRepository
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.aluno', 'aluno')
      .leftJoinAndSelect('o.autor', 'autor')
      .leftJoinAndSelect('o.evidencias', 'evidencias')
      .leftJoinAndSelect('o.comentarios', 'comentarios');

    // Filtros Originais
    if (status) {
      qb.andWhere('o.status = :status', { status });
    }

    if (id_aluno) {
      qb.andWhere('aluno.id = :id_aluno', { id_aluno });
    }

    if (turma) {
      qb.andWhere('aluno.turma = :turma', { turma });
    }

    if (data) {
      qb.andWhere('DATE(o.data_criacao) = :data', { data });
    }

    // filtro de sveridade
    if (severidade) {
      qb.andWhere('o.severidade = :severidade', { severidade });
    }
    if (descricao) {
      qb.andWhere('(o.descricao LIKE :busca OR aluno.nome LIKE :busca)', {
        busca: `%${descricao}%`,
      });
    }

    // Paginação
    qb.skip((page - 1) * limit);
    qb.take(limit);

    // Ordenação das ocorrências
    qb.orderBy('o.data_criacao', 'DESC');

    // Total de registos
    const [dados, total] = await qb.getManyAndCount();
    //retorno estruturado
    return {
      data: dados,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit), //calculo do total de páginas
      },
    };
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
    const ocorrencia = await this.ocorrenciaRepository.findOne({
      where: { id },
      relations: ['aluno', 'autor'],
    });

    if (!ocorrencia) {
      throw new NotFoundException(`Ocorrencia com ID ${id} não encontrada`);
    }
    return ocorrencia;
  }
  //alteração ---> usamos agora o dto validado e recebemos o token do jwt
  async create(dto: CreateOcorrenciaDto, autorId: number): Promise<Ocorrencia> {
    // 1. Apenas verificamos se o aluno existe (sem carregar o objeto para o save)
    const alunoExiste = await this.alunoRepository.findOneBy({
      id: dto.alunoId,
    });

    if (!alunoExiste) {
      throw new NotFoundException(
        `Aluno com ID ${dto.alunoId} não encontrado no sistema`,
      );
    }

    // 2. Criamos a ocorrência mapeando os campos MANUALMENTE
    // NÃO use '...dto' aqui para evitar que o campo 'alunoId' entre na entidade
    const novaOcorrencia = this.ocorrenciaRepository.create({
      categoria: dto.categoria,
      severidade: dto.severidade,
      descricao: dto.descricao,
      contexto: dto.contexto,
      status: StatusOcorrencia.ABERTA,
      // Passamos apenas a referência do ID (o jeito mais seguro no TypeORM)
      aluno: { id: dto.alunoId },
      autor: { id: Number(autorId) }, // Garantimos que o ID seja um número
    });

    // 3. O save agora fará um INSERT puro, sem tentar dar UPDATE em nada
    return await this.ocorrenciaRepository.save(novaOcorrencia);
  }

  async update(ocorrencia: Partial<Ocorrencia>): Promise<Ocorrencia | null> {
    await this.ocorrenciaRepository.update(ocorrencia.id, ocorrencia);
    return this.ocorrenciaRepository.findOneBy({ id: ocorrencia.id });
  }
  //adicionado método pra registrar a ciência do aluno/responsável
  async registrarCiencia(id: number): Promise<Ocorrencia> {
    const ocorrencia = await this.ocorrenciaRepository.findOne({
      where: { id },
    });
    if (!ocorrencia) {
      throw new NotFoundException(`Ocorrência com ID ${id} não encontrada`);
    }
    ocorrencia.ciencia = true; //atualiza a flag para verdadeira

    return await this.ocorrenciaRepository.save(ocorrencia); //salva a atualização no banco de dados
  }

  async atualizarStatus(
    id: number,
    dto: AtualizarStatusDto,
  ): Promise<Ocorrencia> {
    // Busca a ocorrência
    const ocorrencia = await this.ocorrenciaRepository.findOne({
      where: { id },
    });

    if (!ocorrencia) {
      throw new NotFoundException(
        `Ocorrência com ID ${id} não encontrada no sistema.`,
      );
    }

    //Exigir Justificativa ao MARCAR como RESOLVIDA
    if (dto.status === StatusOcorrencia.RESOLVIDA) {
      if (!dto.justificativa || dto.justificativa.trim() === '') {
        throw new BadRequestException(
          'É obrigatório fornecer uma justificativa para marcar a ocorrência como RESOLVIDA',
        );
      }
    }

    //Exigir Justificativa se já estava RESOLVIDA e vai reabrir
    if (
      ocorrencia.status === StatusOcorrencia.RESOLVIDA &&
      dto.status !== StatusOcorrencia.RESOLVIDA
    ) {
      if (!dto.justificativa || dto.justificativa.trim() === '') {
        throw new BadRequestException(
          'É obrigatório fornecer uma justificativa para alterar o status de uma ocorrência já resolvida',
        );
      }
    }
    // Atualiza os dados
    ocorrencia.status = dto.status;

    if (dto.justificativa) {
      ocorrencia.justificativa = dto.justificativa;
    }

    // Salva e devolve a ocorrência atualizada
    return await this.ocorrenciaRepository.save(ocorrencia);
  }
}
