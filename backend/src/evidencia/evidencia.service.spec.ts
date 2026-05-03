import { Test, TestingModule } from '@nestjs/testing';
import { EvidenciaService } from './evidencia.service';

describe('EvidenciaService', () => {
  let service: EvidenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvidenciaService],
    }).compile();

    service = module.get<EvidenciaService>(EvidenciaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
