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
});
