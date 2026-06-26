import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let usuarioRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    usuarioRepo = module.get(getRepositoryToken(Usuario));
  });

  describe('findOneById', () => {
    it('deve retornar um usuário por ID', async () => {
      const usuarioFake = {
        id: 1,
        email: 'pedrolira@email.com',
        cpf: '12334255467',
        nome: 'Pedro',
      };
      usuarioRepo.findOneBy.mockResolvedValue(usuarioFake);

      const resultado = await service.findOneById(1);

      expect(resultado).toEqual(usuarioFake);
    });

    it('deve retornar null quando usuário não existe', async () => {
      usuarioRepo.findOneBy.mockResolvedValue(null);

      const resultado = await service.findOneById(999);

      expect(resultado).toBeNull();
    });
  });

  describe('findOneByCPF', () => {
    it('deve retornar um usuário por CPF', async () => {
      const usuarioFake = {
        id: 1,
        email: 'anamaria@email.com',
        cpf: '08398798000',
        nome: 'Ana',
      };
      usuarioRepo.findOneBy.mockResolvedValue(usuarioFake);

      const resultado = await service.findOneByCPF('12345678900');

      expect(resultado).toEqual(usuarioFake);
    });

    it('deve retornar null quando CPF não existe', async () => {
      usuarioRepo.findOneBy.mockResolvedValue(null);

      const resultado = await service.findOneByCPF('00000000000');

      expect(resultado).toBeNull();
    });
  });

  describe('findOneByEmail', () => {
    it('deve retornar um usuário por email', async () => {
      const usuarioFake = {
        id: 1,
        email: 'testecom@email.com',
        cpf: '12345678900',
        nome: 'João',
      };
      usuarioRepo.findOneBy.mockResolvedValue(usuarioFake);

      const resultado = await service.findOneByEmail('test@email.com');

      expect(resultado).toEqual(usuarioFake);
    });

    it('deve retornar null quando email não existe', async () => {
      usuarioRepo.findOneBy.mockResolvedValue(null);

      const resultado = await service.findOneByEmail('emailfake@email.com');

      expect(resultado).toBeNull();
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários', async () => {
      const usuariosFake = [
        { id: 1, email: 'teste1@email.com', cpf: '12345678900' },
        { id: 2, email: 'teste2@email.com', cpf: '98765432100' },
      ];
      usuarioRepo.find.mockResolvedValue(usuariosFake);

      const resultado = await service.findAll();

      expect(resultado).toHaveLength(2);
      expect(resultado).toEqual(usuariosFake);
    });

    it('deve retornar array vazio quando não há usuários', async () => {
      usuarioRepo.find.mockResolvedValue([]);

      const resultado = await service.findAll();

      expect(resultado).toEqual([]);
    });
  });

  describe('create', () => {
    it('deve criar um usuário quando email é válido', async () => {
      const usuarioDto = {
        email: 'carlosnovo@email.com',
        cpf: '12345678900',
        nome: 'Carlos',
        senha: '03456',
        funcao: 'ADMIN',
      };
      const usuarioFake = { id: 1, ...usuarioDto };
      usuarioRepo.findOneBy.mockResolvedValue(null);
      usuarioRepo.create.mockReturnValue(usuarioFake);
      usuarioRepo.save.mockResolvedValue(usuarioFake);

      const resultado = await service.create(usuarioDto);

      expect(resultado).toEqual(usuarioFake);
      expect(usuarioRepo.create).toHaveBeenCalledWith(usuarioDto);
    });

    it('deve lançar ConflictException quando email já existe', async () => {
      const usuarioDto = {
        email: 'dantasatual@email.com',
        cpf: '12345678900',
        nome: 'Dantas',
        senha: '01987',
        funcao: 'ADMIN',
      };
      const usuarioExistente = { id: 1, email: 'existente@email.com' };
      usuarioRepo.findOneBy.mockResolvedValue(usuarioExistente);

      await expect(service.create(usuarioDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
