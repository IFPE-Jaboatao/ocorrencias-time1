import { ConflictException, Injectable } from '@nestjs/common';
import { Funcao } from './enums/funcaoUsuario.enum';
import { Usuario } from 'src/usuario/usuario.entity';
import { RegisterDto } from './dto/createUsuario.dto';
import { TurmaService } from 'src/turma/turma.service';
import { ResponsavelService } from 'src/responsavel/responsavel.service';
import { AlunoService } from 'src/aluno/aluno.service';
import { ProfessorService } from 'src/professor/professor.service';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly alunoService: AlunoService,
    private readonly responsavelService: ResponsavelService,
    private readonly turmaService: TurmaService,
    private readonly professorService: ProfessorService,
  ) {}

  async validarDadosEspecificos(body: RegisterDto) {
    switch (body.funcao) {
      case Funcao.RESPONSAVEL:
        const existTelefone = await this.responsavelService.findByTelefone(
          body.telefone,
        );
        if (existTelefone) {
          throw new ConflictException(
            'Telefone já cadastrado para outro responsável.',
          );
        }
        break;
      case Funcao.ALUNO:
        const existmatricula = await this.alunoService.findByMatricula(
          body.matricula,
        );
        if (existmatricula) {
          throw new ConflictException(
            'Matrícula já cadastrada para outro aluno.',
          );
        }
        break;
    }
  }

  async criarPerfilEspecifico(body: RegisterDto, usuario: Usuario) {
    switch (body.funcao) {
      case Funcao.ALUNO:
        const turma = await this.turmaService.findOneById(body.turmaId);
        await this.alunoService.create({
          matricula: body.matricula,
          turma,
          usuario,
        });
        break;
      case Funcao.RESPONSAVEL:
        await this.responsavelService.create({
          telefone: body.telefone,
          usuario,
        });
        break;
      case Funcao.PROFESSOR:
        await this.professorService.create({
          matricula: body.matricula,
          usuario,
        });
        break;
    }
  }
}
