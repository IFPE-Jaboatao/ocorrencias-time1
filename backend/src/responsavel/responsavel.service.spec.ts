import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ResponsavelService } from './responsavel.service';
import { Responsavel } from './responsavel.entity';

describe('ResponsavelService', () => {
  let service: ResponsavelService;
  let responsavelRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponsavelService,
        {
          provide: getRepositoryToken(Responsavel),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ResponsavelService>(ResponsavelService);
    responsavelRepo = module.get(getRepositoryToken(Responsavel));
  });
  describe('findAll', () => {
    it('deve retornar todos os responsáveis', async () => {
      const responsaveisFake = [
        { id: 1, telefone: '81999999999', usuario: { id: 1 } },
        { id: 2, telefone: '81988888888', usuario: { id: 2 } },
      ];
      responsavelRepo.find.mockResolvedValue(responsaveisFake);

      const resultado = await service.findAll();

      expect(resultado).toHaveLength(2);
      expect(resultado).toEqual(responsaveisFake);
    });

    it('deve retornar array vazio quando não há responsáveis', async () => {
      responsavelRepo.find.mockResolvedValue([]);

      const resultado = await service.findAll();

      expect(resultado).toEqual([]);
    });
  });
});
