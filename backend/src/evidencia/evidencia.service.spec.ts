import { Test } from '@nestjs/testing';
import { EvidenciaService } from './evidencia.service';
import { Evidencia } from './evidencia.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { join } from 'path/win32';
import { NotFoundException } from '@nestjs/common';

describe('EvidenciaService', () => {
  let service: EvidenciaService;
  let evidenciaRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvidenciaService,
        {
          provide: getRepositoryToken(Evidencia),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = await module.get<EvidenciaService>(EvidenciaService);
    evidenciaRepo = module.get(getRepositoryToken(Evidencia));
  });

  describe('findAll', () => {
    it('deve retornar uma lista de evidências', async () => {
      // Arrange
      const evidenciasFake = [
        { id: 1, nome: 'Evidência 1' },
        { id: 2, nome: 'Evidência 2' },
      ];
      evidenciaRepo.find.mockResolvedValue(evidenciasFake);

      // Act
      const resultado = await service.findAll();

      // Assert
      expect(resultado).toEqual(evidenciasFake);
      expect(evidenciaRepo.find).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('deve retornar uma evidência quando encontra o ID', async () => {
      // Arrange
      const evidenciaFake = { id: 1, nome: 'Evidência 1' };
      evidenciaRepo.findOneBy.mockResolvedValue(evidenciaFake);

      // Act
      const resultado = await service.findOneById(1);

      // Assert
      expect(resultado).toEqual(evidenciaFake);
      expect(evidenciaRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('deve retornar null quando o ID não existe', async () => {
      // Arrange
      evidenciaRepo.findOneBy.mockResolvedValue(null);

      // Act
      const resultado = await service.findOneById(999);

      // Assert
      expect(resultado).toBeNull();
    });
  });

  describe('create', () => {
    it('deve criar uma nova evidência', async () => {
      // Arrange
      const evidenciaFake = { path: 'caminho/para/evidencia' };
      const evidenciaCriada = { id: 1, ...evidenciaFake };
      evidenciaRepo.create.mockReturnValue(evidenciaCriada);
      evidenciaRepo.save.mockResolvedValue(evidenciaCriada);

      // Act
      const resultado = await service.create(evidenciaFake);

      // Assert
      expect(resultado).toEqual(evidenciaCriada);
      expect(evidenciaRepo.create).toHaveBeenCalledWith(evidenciaFake);
      expect(evidenciaRepo.save).toHaveBeenCalledWith(evidenciaCriada);
    });
  });

  describe('update', () => {
    it('deve atualizar uma evidência existente', async () => {
      // Arrange
      const evidenciaAtualizada = {
        id: 1,
        path: 'novo/caminho/para/evidencia',
      };
      evidenciaRepo.update.mockResolvedValue(undefined);
      evidenciaRepo.findOneBy.mockResolvedValue(evidenciaAtualizada);

      // Act
      const resultado = await service.update(evidenciaAtualizada);

      // Assert
      expect(resultado).toEqual(evidenciaAtualizada);
      expect(evidenciaRepo.update).toHaveBeenCalledWith(
        evidenciaAtualizada.id,
        evidenciaAtualizada,
      );
      expect(evidenciaRepo.findOneBy).toHaveBeenCalledWith({
        id: evidenciaAtualizada.id,
      });
    });

    it('deve retornar null quando a evidência não existe', async () => {
      // Arrange
      const evidenciaInexistente = { id: 999, path: 'caminho/inexistente' };
      evidenciaRepo.update.mockResolvedValue(undefined);
      evidenciaRepo.findOneBy.mockResolvedValue(null);

      // Act
      const resultado = await service.update(evidenciaInexistente);

      // Assert
      expect(resultado).toBeNull();
    });
  });

  describe('getFilePath', () => {
    it('deve retornar o caminho completo do arquivo quando ele existe', () => {
      // Arrange
      const file = 'teste.txt';
      const expectedPath = join(process.cwd(), 'uploads', file);

      // Act
      const resultado = service.getFilePath(file);

      // Assert
      expect(resultado).toEqual(expectedPath);
    });

    it('deve lançar NotFoundException quando o arquivo não existe', () => {
      // Arrange
      const fileInexistente = 'inexistente.txt';

      // Act + Assert
      expect(() => service.getFilePath(fileInexistente)).toThrow(
        NotFoundException,
      );
    });
  });
});
