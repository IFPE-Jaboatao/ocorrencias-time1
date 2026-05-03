import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Funcao } from '../enums/funcao-usuario.enum';

export class RegisterDto {
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @IsString()
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @IsString()
  senha: string;

  @IsNotEmpty({ message: 'Função é obrigatória.' })
  @IsEnum(Funcao, { message: 'Função inválida.' })
  funcao: Funcao;

  // Campos opcionais dependendo do tipo (admin, aluno, professor ou responsável)
  @IsOptional()
  @IsString()
  nome: string; // Para Aluno e Responsável

  @IsOptional()
  @IsString()
  turma?: string; // Para Aluno

  @IsOptional()
  @IsString()
  cpf?: string; // Para Responsável

  @IsOptional()
  @IsString()
  telefone?: string; // Para Responsável

  @IsOptional()
  @IsString()
  matricula?: string; // Para Aluno
}
