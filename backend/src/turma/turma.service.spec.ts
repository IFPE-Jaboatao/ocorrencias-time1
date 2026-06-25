import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { TurmaService } from './turma.service';
import { Turma } from './turma.entity';
import { Turno } from './enum/turno.enum';

describe('TurmaService', () => {
  let service: TurmaService;
  let turmaRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TurmaService,
        {
          provide: getRepositoryToken(Turma),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TurmaService>(TurmaService);
    turmaRepo = module.get(getRepositoryToken(Turma));
  });
  describe('findAll', () => {
    it('deve retornar todas as turmas quando existirem', async () => {
      const turmasFake = [
        { id: 1, serie: 1, turma: 'A', turno: Turno.MANHA },
        { id: 2, serie: 1, turma: 'B', turno: Turno.TARDE },
        { id: 3, serie: 2, turma: 'A', turno: Turno.NOITE },
      ];
      turmaRepo.find.mockResolvedValue(turmasFake);

      const resultado = await service.findAll();

      expect(resultado).toHaveLength(3);
      expect(resultado).toEqual(turmasFake);
    });
    it('deve retornar um array vazio quando turmas não forem encontradas', async () => {
      turmaRepo.find.mockResolvedValue([]);

      const resultado = await service.findAll();

      expect(resultado).toEqual([]);
    });
  });
  describe('findOneById', () => {
    it('deve retornar a turma quando encontrada usando o ID', async () => {
      const turmaFake = { id: 1, serie: 1, turma: 'A', turno: Turno.MANHA };
      turmaRepo.findOneBy.mockResolvedValue(turmaFake);

      const resultado = await service.findOneById(1);

      expect(resultado).toEqual(turmaFake);
      expect(turmaRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
    it('deve retornar vazio quando a turma não existir', async () => {
      turmaRepo.findOneBy.mockResolvedValue(null);

      const resultado = await service.findOneById(999);

      expect(resultado).toBeNull();
    });
  });
  describe('findOneBySerie', () => {
    it('deve retornar uma turma quando for localizada pela série', async () => {
      const turmaFake = { id: 1, serie: 1, turma: 'A', turno: Turno.MANHA };
      turmaRepo.findOneBy.mockResolvedValue(turmaFake);

      const resultado = await service.findOneBySerie(1);

      expect(resultado).toEqual(turmaFake);
      expect(turmaRepo.findOneBy).toHaveBeenCalledWith({ serie: 1 });
    });
    it('deve retornar null quando série não existe', async () => {
      turmaRepo.findOneBy.mockResolvedValue(null);

      const resultado = await service.findOneBySerie(99);

      expect(resultado).toBeNull();
    });
  });
});
