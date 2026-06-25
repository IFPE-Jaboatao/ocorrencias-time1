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
});
