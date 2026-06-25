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
      const resultado = await service.registrarCiencia(1);
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
      const resultado = await service.atualizarStatus(
        1,
        StatusOcorrencia.RESOLVIDA,
      );

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
});
