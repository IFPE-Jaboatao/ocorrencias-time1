import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
//adicionados importacoes do jwt e usuario service para que o auth.service possa funcionar corretamente

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        //mock do usuarioservice
        //teste de unidade, sem necessidade de acessar o db
        {
          provide: UsuarioService,
          useValue: {
            //ao inves do service real, um objeto vazio é entregado com uma 'funcão de verificação'
            findOne: jest.fn(),
          },
        },
        //mock do jwtservice
        //mesma lógica do authservice acima
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
