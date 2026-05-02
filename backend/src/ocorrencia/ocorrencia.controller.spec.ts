import { Test, TestingModule } from '@nestjs/testing';
import { OcorrenciaController } from './ocorrencia.controller';

describe('OcorrenciaController', () => {
  let controller: OcorrenciaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OcorrenciaController],
    }).compile();

    controller = module.get<OcorrenciaController>(OcorrenciaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
