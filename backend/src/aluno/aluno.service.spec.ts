import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { AlunoService } from './aluno.service';
import { Aluno } from './aluno.entity';

describe('AlunoService', () => {
  let service: AlunoService;
  let alunoRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlunoService,
        {
          provide: getRepositoryToken(Aluno),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AlunoService>(AlunoService);
    alunoRepo = module.get(getRepositoryToken(Aluno));
  });

  describe('findByMatricula', () => {
    it('deve retornar um aluno quando encontra a matrícula', async () => {
      // Arrange
      const alunoFake = { id: 1, matricula: '20261ADS0042', nome: 'João' };
      alunoRepo.findOne.mockResolvedValue(alunoFake);

      // Act
      const resultado = await service.findByMatricula('20261ADS0042');

      // Assert
      expect(resultado).toEqual(alunoFake);
      expect(alunoRepo.findOne).toHaveBeenCalledWith({
        where: { matricula: '20261ADS0042' },
        relations: expect.any(Array),
      });
    });

    it('deve retornar null quando matrícula não existe', async () => {
      // Arrange
      alunoRepo.findOne.mockResolvedValue(null);

      // Act
      const resultado = await service.findByMatricula('MATRICULA_INEXISTENTE');

      // Assert
      expect(resultado).toBeNull();
    });
  });
  describe('findAll', () => {
    it('deve entregar uma lista de alunos', async () => {
      // Arrange
      const alunosFake = [
        { id: 1, matricula: '20261ADS0001', nome: 'João' },
        { id: 2, matricula: '20261ADS0002', nome: 'Maria' },
        { id: 3, matricula: '20261ADS0003', nome: 'Pedro' },
      ];
      alunoRepo.find.mockResolvedValue(alunosFake);

      // Act
      const resultado = await service.findAll();

      // Assert
      expect(resultado).toHaveLength(3);
      expect(resultado).toEqual(alunosFake);
    });
    it('deve retornar um array vazio quando não há alunos', async () => {
      // Arrange
      alunoRepo.find.mockResolvedValue([]);

      // Act
      const resultado = await service.findAll();

      // Assert
      expect(resultado).toEqual([]);
    });
  });
  describe('findOneById', () => {
    it('deve retornar um aluno pelo id', async () => {
      const alunoFake = {
        id: 1,
        matricula: '20261ADS0001',
        nome: 'Ana',
        turma: null,
        usuario: null,
        responsaveis: [],
        ocorrencias: [],
      };
      alunoRepo.findOne.mockResolvedValue(alunoFake);

      //act
      const resultado = await service.findOneById(1);

      //assert
      expect(resultado).toEqual(alunoFake);
    });
    it('deve retornar vazio quando aluno não exise', async () => {
      alunoRepo.findOne.mockResolvedValue(null);
      const resultado = await service.findOneById(999);
      expect(resultado).toBeNull();
    });
  });
  describe('findByUsuarioId', () => {
    it('deve retornar um aluno quando encontra por usuarioId', async () => {
      // Arrange
      const alunoFake = {
        id: 1,
        matricula: '20261ADS0042',
        nome: 'João',
        usuario: { id: 5 },
        turma: null,
        responsaveis: [],
        ocorrencias: [],
      };
      alunoRepo.findOne.mockResolvedValue(alunoFake);

      // Act
      const resultado = await service.findByUsuarioId(5);

      // Assert
      expect(resultado).toEqual(alunoFake);
      expect(alunoRepo.findOne).toHaveBeenCalledWith({
        where: { usuario: { id: 5 } },
        relations: expect.any(Array),
      });
    });
    it('deve retornar null quando usuário não tem aluno associado', async () => {
      // Arrange
      alunoRepo.findOne.mockResolvedValue(null);

      // Act
      const resultado = await service.findByUsuarioId(999);

      // Assert
      expect(resultado).toBeNull();
    });
    it('deve criar um aluno quando os dados são válidos', async () => {
      const alunoFake = {
        id: 1,
        matricula: '20261ADS0042',
        nome: 'João',
      };
      alunoRepo.create.mockReturnValue(alunoFake);
      alunoRepo.save.mockResolvedValue(alunoFake);

      const resultado = await service.create(alunoFake);

      expect(resultado).toEqual(alunoFake);
      expect(alunoRepo.create).toHaveBeenCalledWith(alunoFake);
      expect(alunoRepo.save).toHaveBeenCalledWith(alunoFake);
    });
    it('deve lançar ConflictException quando matrícula já existe', async () => {
      // Arrange
      const alunoFake = { matricula: '20261ADS0042', nome: 'João' };
      alunoRepo.create.mockReturnValue(alunoFake);
      alunoRepo.save.mockRejectedValue({ code: 'ER_DUP_ENTRY' });

      // Act + Assert
      await expect(service.create(alunoFake)).rejects.toThrow(
        ConflictException,
      );
    });
    it('deve lançar ConflictException quando matrícula já existe', async () => {
      // Arrange
      const alunoFake = { matricula: '20261ADS0042', nome: 'João' };
      alunoRepo.create.mockReturnValue(alunoFake);
      alunoRepo.save.mockRejectedValue({ code: 'ER_DUP_ENTRY' });

      // Act + Assert
      await expect(service.create(alunoFake)).rejects.toThrow(
        ConflictException,
      );
    });
  });
  describe('update', () => {
    it('deve atualizar os dados de um aluno quando os dados forem válidso', async () => {
      const alunoAtualizado = {
        id: 1,
        matricula: '20261ADS0042',
        nome: 'João Silva',
      };
      alunoRepo.save.mockResolvedValue(alunoAtualizado);

      const resultado = await service.update(alunoAtualizado);

      expect(resultado).toEqual(alunoAtualizado);
      expect(alunoRepo.save).toHaveBeenCalledWith(alunoAtualizado);
    });
    it('deve lançar BadRequestException quando erro ao atualizar', async () => {
      // Arrange
      const alunoAtualizado = { id: 1, nome: 'João Silva' };
      alunoRepo.save.mockRejectedValue(new Error('Erro ao atualizar'));

      // Act + Assert
      await expect(service.update(alunoAtualizado)).rejects.toThrow();
    });
  });
});
