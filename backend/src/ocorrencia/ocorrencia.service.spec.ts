import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { OcorrenciaService } from './ocorrencia.service';
import { Ocorrencia } from './ocorrencia.entity';
import { Aluno } from 'src/aluno/aluno.entity';
import { StatusOcorrencia } from './enum/statusOcorrencia.enum';
import { Severidade } from './enum/severidade.enum';

describe('OcorrenciaService', () => {
  let service: OcorrenciaService;
  let ocorrenciaRepo: any;
  let alunoRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OcorrenciaService,
        {
          provide: getRepositoryToken(Ocorrencia),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Aluno),
          useValue: {
            findOneBy: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OcorrenciaService>(OcorrenciaService);
    ocorrenciaRepo = module.get(getRepositoryToken(Ocorrencia));
    alunoRepo = module.get(getRepositoryToken(Aluno));
  });

  //área dos testes
  describe('registrarCiencia', () => {
    //simula uma ocorrencia encontrada no banco
    it('deve setar ciencia como true quando a ocorrencia existir', async () => {
      const ocorrenciaFake = { id: 1, ciencia: false };
      ocorrenciaRepo.findOne.mockResolvedValue(ocorrenciaFake);
      ocorrenciaRepo.save.mockResolvedValue({
        ...ocorrenciaFake,
        ciencia: true,
      });
      //chama o metodo
      await service.registrarCiencia(1);
      // verifica que a ciencia ficou 'true'
      expect(ocorrenciaRepo.save).toHaveBeenCalledWith({
        id: 1,
        ciencia: true,
      });
    });
    //simula que o banco não encontrou nada
    it('deve lançar NotFoundException quando a ocorrencia for inexistente', async () => {
      ocorrenciaRepo.findOne.mockResolvedValue(null);
      //espera o modulo lançar o erro
      await expect(service.registrarCiencia(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('atualizarStatus', () => {
    it('deve atualizar o status da ocorrência', async () => {
      // Arrange
      const ocorrenciaFake = { id: 1, status: StatusOcorrencia.ABERTA };
      ocorrenciaRepo.findOne.mockResolvedValue(ocorrenciaFake);
      ocorrenciaRepo.save.mockResolvedValue({
        ...ocorrenciaFake,
        status: StatusOcorrencia.RESOLVIDA,
      });

      // Act
      await service.atualizarStatus(1, StatusOcorrencia.RESOLVIDA);

      // verifica se o statuso foi atualizado
      expect(ocorrenciaRepo.save).toHaveBeenCalledWith({
        id: 1,
        status: StatusOcorrencia.RESOLVIDA,
      });
    });
    it('deve lançar NotFoundException quando o status não existe', async () => {
      //verifica se o status é vazio
      ocorrenciaRepo.findOne.mockResolvedValue(null);

      //lança o erro
      await expect(
        service.atualizarStatus(999, StatusOcorrencia.RESOLVIDA),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('validarAluno', () => {
    it('deve encontrar um aluno usando matricula como identificador', async () => {
      const alunoFalso = {
        id: 10,
        matricula: '20261TADS0042',
        usuario: { nome: 'Joao Silva' },
      };
      alunoRepo.findOne.mockResolvedValue(alunoFalso);

      const resultado = await service.validarAluno('20261TADS0042');

      expect(alunoRepo.findOne).toHaveBeenCalledWith({
        where: { matricula: '20261TADS0042' },
        relations: ['usuario'],
      });
      expect(resultado).toEqual({
        id: 10,
        nome: 'Joao Silva',
        matricula: '20261TADS0042',
      });
    });
    it('deve utilizar o fallback e buscar por ID numérico se a matrícula não for encontrada', async () => {
      // Arrange
      const alunoFake = {
        id: 42,
        matricula: '20261ADS0042',
        usuario: { nome: 'Maria Souza' },
      };
      // Simula: 1ª chamada (matrícula) falha, 2ª chamada (ID) tem sucesso
      alunoRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(alunoFake);

      // Act
      const resultado = await service.validarAluno('42');

      // Assert
      expect(alunoRepo.findOne).toHaveBeenNthCalledWith(1, {
        where: { matricula: '42' },
        relations: ['usuario'],
      });
      expect(alunoRepo.findOne).toHaveBeenNthCalledWith(2, {
        where: { id: 42 },
        relations: ['usuario'],
      });
      expect(resultado.nome).toBe('Maria Souza');
    });

    it('deve preencher com "Estudante sem Nome" caso o aluno não possua nome cadastrado', async () => {
      const alunoFakeSemUsuario = {
        id: 15,
        matricula: '12345',
        usuario: null, //simula falta de relação ou nome
      };
      alunoRepo.findOne.mockResolvedValue(alunoFakeSemUsuario);

      const resultado = await service.validarAluno('12345');

      expect(resultado.nome).toBe('Estudante sem Nome');
    });

    it('deve lançar NotFoundException se o aluno não for encontrado por nenhum método', async () => {
      //verifica se o valor retornado é nulo
      alunoRepo.findOne.mockResolvedValue(null);

      //lançamento do erro
      await expect(service.validarAluno('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('create', () => {
    const autorIdFixo = 1;
    const dataAtual = new Date();

    // Arrange base -dtobase só para usar em testes pra não repetir código
    const dtoBase = {
      categoria: 'Conduta indisciplinar',
      severidade: Severidade.MEDIA,
      titulo: 'Computador com defeito',
      descricao: 'O aluno disse que o computador não liga.',
      dataOcorrencia: dataAtual,
      turmaId: null,
    };

    it('deve criar uma ocorrência priorizando a matriculaAluno', async () => {
      // Arrange
      const dto = { ...dtoBase, alunoId: 99, matriculaAluno: '20261ADS0042' };
      const alunoMock = { id: 10, matricula: '20261ADS0042' };
      const ocorrenciaMock = {
        id: 1,
        ...dto,
        aluno: { id: 10 },
        status: StatusOcorrencia.ABERTA,
      };

      alunoRepo.findOneBy.mockResolvedValueOnce(alunoMock);
      ocorrenciaRepo.create.mockReturnValue(ocorrenciaMock);
      ocorrenciaRepo.save.mockResolvedValue(ocorrenciaMock);

      // Act
      const resultado = await service.create(dto as any, autorIdFixo);

      // Assert
      expect(alunoRepo.findOneBy).toHaveBeenCalledWith({
        matricula: '20261ADS0042',
      });
      expect(ocorrenciaRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          aluno: { id: 10 },
          status: StatusOcorrencia.ABERTA, // Valida a regra de negócio do status
        }),
      );
      expect(ocorrenciaRepo.save).toHaveBeenCalledWith(ocorrenciaMock);
      expect(resultado).toBeDefined();
    });

    it('deve lançar NotFoundException se a matriculaAluno for enviada, mas o aluno não existir', async () => {
      // Arrange
      const dto = { ...dtoBase, matriculaAluno: 'MATRICULA_INEXISTENTE' };
      alunoRepo.findOneBy.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service.create(dto as any, autorIdFixo)).rejects.toThrow(
        NotFoundException,
      );
      expect(ocorrenciaRepo.create).not.toHaveBeenCalled(); // Garante que não tentou salvar
    });

    it('deve criar uma ocorrência usando alunoId quando matriculaAluno não for enviada', async () => {
      // Arrange
      const dto = { ...dtoBase, alunoId: 5 };
      const alunoMock = { id: 5 };

      alunoRepo.findOneBy.mockResolvedValueOnce(alunoMock);
      ocorrenciaRepo.create.mockReturnValue({});
      ocorrenciaRepo.save.mockResolvedValue({});

      // Act
      await service.create(dto as any, autorIdFixo);

      // Assert
      expect(alunoRepo.findOneBy).toHaveBeenCalledWith({ id: 5 });
      expect(ocorrenciaRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          aluno: { id: 5 },
        }),
      );
    });

    it('deve utilizar o fallback de buscar alunoId como string (matrícula) se a busca por ID numérico falhar', async () => {
      // Arrange
      const dto = { ...dtoBase, alunoId: 2026 }; // Simulando um ID que na verdade é matrícula
      const alunoMockFallback = { id: 99, matricula: '2026' };

      alunoRepo.findOneBy
        .mockResolvedValueOnce(null) // 1ª tentativa falha (ID)
        .mockResolvedValueOnce(alunoMockFallback); // 2ª tentativa acerta (Fallback matrícula)

      ocorrenciaRepo.create.mockReturnValue({});
      ocorrenciaRepo.save.mockResolvedValue({});

      // Act
      await service.create(dto as any, autorIdFixo);

      // Assert
      expect(alunoRepo.findOneBy).toHaveBeenNthCalledWith(1, { id: 2026 });
      expect(alunoRepo.findOneBy).toHaveBeenNthCalledWith(2, {
        matricula: '2026',
      });
    });

    it('deve vincular a turma se turmaId for fornecido', async () => {
      // ffunção do dto
      const dto = { ...dtoBase, alunoId: 1, turmaId: 3 };
      alunoRepo.findOneBy.mockResolvedValueOnce({ id: 1 });
      ocorrenciaRepo.create.mockReturnValue({});
      ocorrenciaRepo.save.mockResolvedValue({});

      // Act
      await service.create(dto as any, autorIdFixo);

      //lança o expect
      expect(ocorrenciaRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          turma: { id: 3 },
        }),
      );
    });
  });
  describe('findOne', () => {
    it('deve retornar uma ocorrência quando existe', async () => {
      // Arrange
      const ocorrenciaFake = {
        id: 1,
        categoria: 'Indisciplina',
        severidade: Severidade.MEDIA,
        status: StatusOcorrencia.ABERTA,
        titulo: 'Aluno indisciplinado',
        descricao: 'Aluno faltou 3 vezes',
        dataCriacao: new Date(),
        dataOcorrencia: new Date(),
        ciencia: false,
        aluno: null, //enviado null apenas para testes
        autor: null,
        evidencias: [],
        turma: null,
      };

      ocorrenciaRepo.findOne.mockResolvedValue(ocorrenciaFake);

      // Act
      const resultado = await service.findOne(1);

      // Assert
      expect(resultado).toEqual(
        expect.objectContaining({
          id: 1,
          categoria: 'Indisciplina',
        }),
      );
    });
  });
  describe('findOne', () => {
    it('deve retornar uma ocorrência quando existe', async () => {
      const ocorrenciaFake = {
        id: 1,
        categoria: 'Indisciplina',
        status: StatusOcorrencia.ABERTA,
        aluno: null,
        autor: null,
        evidencias: [],
      };
      ocorrenciaRepo.findOne.mockResolvedValue(ocorrenciaFake);

      const resultado = await service.findOne(1);

      expect(resultado).toBeDefined();
      expect(ocorrenciaRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: expect.any(Array),
      });
    });

    it('deve retornar null mapeado quando ocorrência não existe', async () => {
      ocorrenciaRepo.findOne.mockResolvedValue(null);

      const resultado = await service.findOne(999);

      expect(resultado).toBeNull();
    });
  });
  describe('findRecentes', () => {
    it('deve retornar as 5 ocorrências mais recentes', async () => {
      // Arrange: simular que o banco retorna 5 ocorrências
      const ocorrenciasFake = [
        { id: 1, dataCriacao: new Date('2024-06-05'), titulo: 'Ocorrência 1' },
        { id: 2, dataCriacao: new Date('2024-06-04'), titulo: 'Ocorrência 2' },
        { id: 3, dataCriacao: new Date('2024-06-03'), titulo: 'Ocorrência 3' },
        { id: 4, dataCriacao: new Date('2024-06-02'), titulo: 'Ocorrência 4' },
        { id: 5, dataCriacao: new Date('2024-06-01'), titulo: 'Ocorrência 5' },
      ];
      ocorrenciaRepo.find.mockResolvedValue(ocorrenciasFake);

      // Act: chamar o método
      const resultado = await service.findRecentes();

      // Assert: verificar que retornou array com 5 elementos
      expect(resultado).toHaveLength(5);
      expect(ocorrenciaRepo.find).toHaveBeenCalledWith({
        order: { dataCriacao: 'DESC' },
        take: 5,
        relations: expect.any(Array),
      });
    });

    it('deve retornar um array vazio quando não há ocorrências', async () => {
      // Arrange
      ocorrenciaRepo.find.mockResolvedValue([]);

      // Act
      const resultado = await service.findRecentes();

      // Assert
      expect(resultado).toEqual([]);
    });
  });
  describe('getDashboardMetrics', () => {
    it('deve retornar as métricas corretamente', async () => {
      ocorrenciaRepo.count.mockResolvedValueOnce(10);
      ocorrenciaRepo.count.mockResolvedValueOnce(3);
      ocorrenciaRepo.count.mockResolvedValueOnce(7);
      jest.spyOn(service, 'findRecentes').mockResolvedValue([]);

      const resultado = await service.getDashboardMetrics();

      expect(resultado.total).toBe(10);
      expect(resultado.pendentes).toBe(3);
      expect(resultado.resolvidas).toBe(7);
      expect(resultado.taxaResolucao).toBe('70.00%');
    });

    it('deve retornar taxa de resolução 0.00% quando não há ocorrências', async () => {
      ocorrenciaRepo.count.mockResolvedValue(0);
      jest.spyOn(service, 'findRecentes').mockResolvedValue([]);

      const resultado = await service.getDashboardMetrics();
      expect(resultado.taxaResolucao).toBe('0.00%');
      expect(resultado.total).toBe(0);
    });
  });
});
