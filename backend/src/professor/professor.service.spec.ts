import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { Professor } from './professor.entity';

describe('ProfessorService', () => {
  let service: ProfessorService;
  let professorRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessorService,
        {
          provide: getRepositoryToken(Professor),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProfessorService>(ProfessorService);
    professorRepo = module.get(getRepositoryToken(Professor));
  });
  describe('findByUsuarioId', () => {
    it('deve retornar um professor quando encontrar ele no sistema', async () => {
      const professorFake = {
        id: 1,
        usuario: { id: 5 },
        alunos: [
          { id: 1, nome: 'João', ocorrencias: [] },
          { id: 2, nome: 'Maria', ocorrencias: [] },
        ],
      };
      professorRepo.findOne.mockResolvedValue(professorFake);

      // Act
      const resultado = await service.findByUsuarioId(5);

      // Assert
      expect(resultado).toEqual(professorFake);
      expect(professorRepo.findOne).toHaveBeenCalledWith({
        where: { usuario: { id: 5 } },
        relations: expect.any(Array),
      });
    });
  });
});
