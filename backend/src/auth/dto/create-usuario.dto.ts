import { Funcao } from '../enums/funcao-usuario.enum';

export class RegisterDto {
  login: string;
  senha: string;
  email: string;
  funcao: Funcao;

  // Campos opcionais dependendo do tipo
  nome?: string; // Para Aluno e Responsável
  turma?: string; // Para Aluno
  cpf?: string; // Para Responsável
  telefone?: string; // Para Responsável
}
