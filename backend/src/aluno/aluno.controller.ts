import { Controller, Get, Req } from '@nestjs/common';
import { OcorrenciaService } from '../ocorrencia/ocorrencia.service';

// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('aluno')
export class AlunoController {
  constructor(private readonly ocorrenciaService: OcorrenciaService) {}

  @Get('ocorrencias')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ALUNO')
  async listarMinhasOcorrencias(@Req() req: any) {
    const alunoId = 1;
    return this.ocorrenciaService.findAllByAluno(alunoId);
  }
}
