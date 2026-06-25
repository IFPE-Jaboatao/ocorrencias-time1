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
});
