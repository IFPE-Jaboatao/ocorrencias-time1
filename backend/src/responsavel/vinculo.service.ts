import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AlunoService } from 'src/aluno/aluno.service';
import { ResponsavelService } from './responsavel.service';

@Injectable()
export class VinculoService {
  constructor(
    private readonly alunoService: AlunoService,
    private readonly responsavelService: ResponsavelService,
  ) {}

  async vincular(responsavelId: number, alunoId: number) {
    const aluno = await this.alunoService.findOneById(alunoId);
    const responsavel =
      await this.responsavelService.findOneById(responsavelId);

    if (!aluno || !responsavel) {
      throw new NotFoundException('Aluno ou Responsável não encontrado');
    }

    const jaVinculado = aluno.responsaveis?.some(
      (res) => res.id === responsavelId,
    );

    if (jaVinculado) {
      throw new ConflictException('Aluno já vinculado a esse responsável');
    }

    aluno.responsaveis = [...(aluno.responsaveis || []), responsavel];
    await this.alunoService.update(aluno);

    return { message: 'Responsável vinculado ao aluno com sucesso' };
  }
}
