import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ocorrencia } from './ocorrencia.entity';
import { Aluno } from 'src/aluno/aluno.entity';
import { CreateOcorrenciaDto } from './dto/createOcorrencia.dto';
import { ListarOcorrenciaDto } from './dto/listarOcorrencia.dto';
import { AtualizarStatusDto } from './dto/atualizarStatus.dto';
import { StatusOcorrencia } from './enum/statusOcorrencia.enum';
@Injectable()
export class OcorrenciaService {
  constructor(
    @InjectRepository(Ocorrencia)
    private readonly ocorrenciaRepository: Repository<Ocorrencia>,
    @InjectRepository(Aluno)
    private readonly alunoRepository: Repository<Aluno>,
  ) {}

  async findAll(filtros: ListarOcorrenciaDto) {
    const {
      status,
      alunoId,
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

    if (alunoId) {
      qb.andWhere('aluno.id = :alunoId', { alunoId });
    }

    if (turma) {
      qb.andWhere('aluno.turma = :turma', { turma });
    }

    if (data) {
      qb.andWhere('DATE(o.dataCriacao) = :data', { data });
    }

    // filtro de severidade
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
    qb.orderBy('o.dataCriacao', 'DESC');

    // Total de registos
    const [dados, total] = await qb.getManyAndCount();
    return {
      data: dados,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findRecentes(): Promise<Ocorrencia[]> {
    return this.ocorrenciaRepository.find({
      order: {
        dataCriacao: 'DESC',
      },
      take: 5,
      relations: {
        aluno: true,
        autor: true,
      },
    });
  }

  async getDashboardMetrics() {
    const total = await this.ocorrenciaRepository.count();

    const pendentes = await this.ocorrenciaRepository.count({
      where: { status: StatusOcorrencia.ABERTA },
    });

    const resolvidas = await this.ocorrenciaRepository.count({
      where: { status: StatusOcorrencia.RESOLVIDA },
    });

    const taxaResolucao =
      total > 0 ? ((resolvidas / total) * 100).toFixed(2) + '%' : '0.00%';

    return {
      total,
      pendentes,
      resolvidas,
      taxaResolucao,
      ocorrenciasRecentes: await this.findRecentes(),
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
  async create(dto: CreateOcorrenciaDto, autorId: number): Promise<Ocorrencia> {
    const alunoExiste = await this.alunoRepository.findOneBy({
      id: dto.alunoId,
    });

    if (!alunoExiste) {
      throw new NotFoundException(
        `Aluno com ID ${dto.alunoId} não encontrado no sistema`,
      );
    }

    const novaOcorrencia = this.ocorrenciaRepository.create({
      categoria: dto.categoria,
      severidade: dto.severidade,
      titulo: dto.titulo,
      descricao: dto.descricao,
      dataOcorrencia: dto.dataOcorrencia,
      status: StatusOcorrencia.ABERTA,
      aluno: { id: dto.alunoId },
      autor: { id: Number(autorId) },
    });

    return await this.ocorrenciaRepository.save(novaOcorrencia);
  }

  async update(ocorrencia: Partial<Ocorrencia>): Promise<Ocorrencia | null> {
    await this.ocorrenciaRepository.update(ocorrencia.id, ocorrencia);
    return this.ocorrenciaRepository.findOneBy({ id: ocorrencia.id });
  }
  async registrarCiencia(id: number): Promise<Ocorrencia> {
    const ocorrencia = await this.ocorrenciaRepository.findOne({
      where: { id },
    });
    if (!ocorrencia) {
      throw new NotFoundException(`Ocorrência com ID ${id} não encontrada`);
    }
    ocorrencia.ciencia = true;

    return await this.ocorrenciaRepository.save(ocorrencia);
  }

  async atualizarStatus(
    id: number,
    dto: AtualizarStatusDto,
  ): Promise<Ocorrencia> {
    const ocorrencia = await this.ocorrenciaRepository.findOne({
      where: { id },
    });

    if (!ocorrencia) {
      throw new NotFoundException(
        `Ocorrência com ID ${id} não encontrada no sistema.`,
      );
    }

    ocorrencia.status = dto.status;

    return await this.ocorrenciaRepository.save(ocorrencia);
  }
}
