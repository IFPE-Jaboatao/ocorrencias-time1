import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ocorrencia } from './ocorrencia.entity';
import { Aluno } from 'src/aluno/aluno.entity';
import { CreateOcorrenciaDto } from './dto/createOcorrencia.dto';
import { ListarOcorrenciaDto } from './dto/listarOcorrencia.dto';
import { StatusOcorrencia } from './enum/statusOcorrencia.enum';
@Injectable()
export class OcorrenciaService {
  constructor(
    @InjectRepository(Ocorrencia)
    private readonly ocorrenciaRepository: Repository<Ocorrencia>,
    @InjectRepository(Aluno)
    private readonly alunoRepository: Repository<Aluno>,
  ) {}

  private mapearOcorrencia(ocorrencia: Ocorrencia) {
    if (!ocorrencia) return null;

    let autorUsuario = null;
    if (ocorrencia.autor) {
      const { senha, cpf, ...dadosPublicosAutor } = ocorrencia.autor;
      autorUsuario = dadosPublicosAutor;
    }

    let alunoTratado = null;
    if (ocorrencia.aluno) {
      const { usuario, responsaveis, turma, ...dadosAluno } = ocorrencia.aluno;

      const usuarioAlunoLimpo = usuario
        ? {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            funcao: usuario.funcao,
          }
        : null;

      const responsaveisLimpos =
        responsaveis?.map((resp) => {
          const u = resp.usuario;
          return {
            id: resp.id,
            usuario: u
              ? { id: u.id, nome: u.nome, email: u.email, funcao: u.funcao }
              : null,
          };
        }) || [];

      alunoTratado = {
        ...dadosAluno,
        usuario: usuarioAlunoLimpo,
        turma: turma || null,
        responsaveis: responsaveisLimpos,
      };
    }

    return {
      id: ocorrencia.id,
      categoria: ocorrencia.categoria,
      severidade: ocorrencia.severidade,
      status: ocorrencia.status,
      titulo: ocorrencia.titulo,
      descricao: ocorrencia.descricao,
      dataCriacao: ocorrencia.dataCriacao,
      dataOcorrencia: ocorrencia.dataOcorrencia,
      ciencia: ocorrencia.ciencia,
      aluno: alunoTratado,
      autorUsuario: autorUsuario, // renomeado para evitar confusão com o usuário do aluno
      evidencias: ocorrencia.evidencias,
      turma: ocorrencia.turma,
    };
  }

  async findAll(filtros: ListarOcorrenciaDto) {
    const {
      status,
      alunoId,
      data,
      turmaId,
      severidade,
      page = 1,
      limit = 10,
    } = filtros;

    const qb = this.ocorrenciaRepository
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.aluno', 'aluno')
      .leftJoinAndSelect('aluno.turma', 'alunoTurma') // turma do aluno
      .leftJoinAndSelect('aluno.usuario', 'alunoUsuario')
      .leftJoinAndSelect('aluno.responsaveis', 'responsaveis')
      .leftJoinAndSelect('responsaveis.usuario', 'responsaveisUsuario')
      .leftJoinAndSelect('o.autor', 'autor')
      .leftJoinAndSelect('o.evidencias', 'evidencias')
      .leftJoinAndSelect('o.turma', 'turma'); // turma da ocorrência (pode ser null)

    // Filtros Originais
    if (status) {
      qb.andWhere('o.status = :status', { status });
    }
    if (alunoId) {
      qb.andWhere('aluno.id = :alunoId', { alunoId });
    }

    if (turmaId) {
      qb.andWhere('turma.id = :turmaId', { turmaId });
    }

    if (data) {
      qb.andWhere('DATE(o.dataCriacao) = :data', { data });
    }
    if (severidade) {
      qb.andWhere('o.severidade = :severidade', { severidade });
    }

    // Paginação
    qb.skip((page - 1) * limit);
    qb.take(limit);
    qb.orderBy('o.dataCriacao', 'DESC');

    const [dados, total] = await qb.getManyAndCount();

    // Mapeamento para limpar dados sensíveis e reestruturar o JSON
    const ocorrenciasTratadas = dados.map((ocorrencia) =>
      this.mapearOcorrencia(ocorrencia),
    );

    return {
      ocorrencias: ocorrenciasTratadas,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findRecentes(): Promise<any[]> {
    const ultimasOcorrencias = await this.ocorrenciaRepository.find({
      order: {
        dataCriacao: 'DESC',
      },
      take: 5,
      relations: [
        'aluno',
        'autor',
        'evidencias',
        'turma',
        'aluno.turma',
        'aluno.usuario',
        'aluno.responsaveis',
        'aluno.responsaveis.usuario',
      ],
    });

    // Mapeamento para limpar dados sensíveis e reestruturar o JSON
    const ocorrenciasTratadas = ultimasOcorrencias.map((ocorrencia) =>
      this.mapearOcorrencia(ocorrencia),
    );

    return ocorrenciasTratadas;
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
  async findAllByAluno(alunoId: number): Promise<any[]> {
    const ocorrencias = await this.ocorrenciaRepository.find({
      where: { aluno: { id: alunoId } },
      relations: [
        'aluno',
        'aluno.turma',
        'aluno.usuario',
        'aluno.responsaveis',
        'aluno.responsaveis.usuario',
        'autor',
        'evidencias',
        'turma',
      ],
    });

    // Mapeamento para limpar dados sensíveis e reestruturar o JSON
    const ocorrenciasTratadas = ocorrencias.map((ocorrencia) =>
      this.mapearOcorrencia(ocorrencia),
    );
    return ocorrenciasTratadas;
  }

  async findOne(id: number): Promise<any> {
    const ocorrencia = await this.ocorrenciaRepository.findOne({
      where: { id },
      relations: [
        'aluno',
        'aluno.turma',
        'aluno.usuario',
        'aluno.responsaveis',
        'aluno.responsaveis.usuario',
        'autor',
        'evidencias',
        'turma',
      ],
    });
    return this.mapearOcorrencia(ocorrencia);
  }

  async create(dto: CreateOcorrenciaDto, autorId: number): Promise<any> {
    let idDoAlunoFinal = dto.alunoId;
    if (dto.matriculaAluno) {
      const alunoPorMatricula = await this.alunoRepository.findOneBy({
        matricula: dto.matriculaAluno,
      });

      if (!alunoPorMatricula) {
        throw new NotFoundException(
          `Aluno com matrícula ${dto.matriculaAluno} não encontrado no sistema`,
        );
      }
      idDoAlunoFinal = alunoPorMatricula.id;
    } else {
      let alunoExiste = await this.alunoRepository.findOneBy({
        id: idDoAlunoFinal,
      });

      if (!alunoExiste && idDoAlunoFinal) {
        alunoExiste = await this.alunoRepository.findOneBy({
          matricula: String(idDoAlunoFinal),
        });
      }

      if (!alunoExiste) {
        throw new NotFoundException(
          `Aluno com identificador/ID ${idDoAlunoFinal} não encontrado no sistema`,
        );
      }

      idDoAlunoFinal = alunoExiste.id;
    }

    const novaOcorrencia = this.ocorrenciaRepository.create({
      categoria: dto.categoria,
      severidade: dto.severidade,
      titulo: dto.titulo,
      descricao: dto.descricao,
      dataOcorrencia: dto.dataOcorrencia,
      status: StatusOcorrencia.ABERTA,
      aluno: { id: idDoAlunoFinal },
      autor: { id: Number(autorId) },
      turma: dto.turmaId ? { id: dto.turmaId } : null, // REGRA DE NEGÓCIO: a ocorrência pode ter envolvimento de uma turma ou não
    });

    return this.mapearOcorrencia(
      await this.ocorrenciaRepository.save(novaOcorrencia),
    );
  }

  async registrarCiencia(id: number): Promise<any> {
    const ocorrencia = await this.ocorrenciaRepository.findOne({
      where: { id },
    });
    if (!ocorrencia) {
      throw new NotFoundException(`Ocorrência com ID ${id} não encontrada`);
    }
    ocorrencia.ciencia = true;

    return this.mapearOcorrencia(
      await this.ocorrenciaRepository.save(ocorrencia),
    );
  }

  async atualizarStatus(id: number, status: StatusOcorrencia): Promise<any> {
    const ocorrencia = await this.ocorrenciaRepository.findOne({
      where: { id },
      relations: [
        'aluno',
        'aluno.turma',
        'aluno.usuario',
        'aluno.responsaveis',
        'aluno.responsaveis.usuario',
        'autor',
        'evidencias',
        'turma',
      ],
    });

    if (!ocorrencia) {
      throw new NotFoundException(
        `Ocorrência com ID ${id} não encontrada no sistema.`,
      );
    }

    ocorrencia.status = status;
    console.log(ocorrencia);

    return this.mapearOcorrencia(
      await this.ocorrenciaRepository.save(ocorrencia),
    );
  }
  async validarAluno(identificador: string): Promise<any> {
    let aluno = await this.alunoRepository.findOne({
      where: { matricula: identificador },
      relations: ['usuario'],
    });

    if (!aluno && /^\d+$/.test(identificador)) {
      aluno = await this.alunoRepository.findOne({
        where: { id: Number(identificador) },
        relations: ['usuario'],
      });
    }
    if (!aluno) {
      throw new NotFoundException(
        `Nenhum estudante encontrado com o identificador: ${identificador}`,
      );
    }
    return {
      id: aluno.id,
      nome: aluno.usuario?.nome || 'Estudante sem Nome',
      matricula: aluno.matricula,
    };
  }
}
