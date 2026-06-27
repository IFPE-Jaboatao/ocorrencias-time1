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
    it('deve retornar um professor quando encontra por usuarioId', async () => {
      const professorFake = {
        id: 1,
        usuario: { id: 5 },
        alunos: [
          { id: 1, nome: 'João', ocorrencias: [] },
          { id: 2, nome: 'Maria', ocorrencias: [] },
        ],
      };
      professorRepo.findOne.mockResolvedValue(professorFake);

      const resultado = await service.findByUsuarioId(5);

      expect(resultado).toEqual(professorFake);
      expect(professorRepo.findOne).toHaveBeenCalledWith({
        where: { usuario: { id: 5 } },
        relations: expect.any(Array),
      });
    });

    it('deve lançar NotFoundException quando professor não existe', async () => {
      professorRepo.findOne.mockResolvedValue(null);

      await expect(service.findByUsuarioId(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('deve criar um professor quando dados são válidos', async () => {
      const professorDto = { usuario: { id: 5 }, alunos: [] };
      const professorFake = { id: 1, usuario: { id: 5 }, alunos: [] };
      professorRepo.create.mockReturnValue(professorFake);
      professorRepo.save.mockResolvedValue(professorFake);

      const resultado = await service.create(professorDto);

      expect(resultado).toEqual(professorFake);
      expect(professorRepo.create).toHaveBeenCalledWith(professorDto);
      expect(professorRepo.save).toHaveBeenCalled();
    });

    it('deve lançar erro quando falha ao criar professor', async () => {
      const professorDto = { usuario: { id: 5 } };
      professorRepo.create.mockReturnValue(professorDto);
      professorRepo.save.mockRejectedValue(new Error('Erro ao salvar'));

      await expect(service.create(professorDto)).rejects.toThrow();
    });
  });
});
