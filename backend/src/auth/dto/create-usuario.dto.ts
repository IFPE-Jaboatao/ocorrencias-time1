import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsEmail,
} from 'class-validator';
import { Funcao } from '../enums/funcao-usuario.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email do usuário para registro',
    example: 'usuario@example.com',
  })
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @IsEmail({}, { message: 'O e-mail informado não tem um formato válido.' }) // 👈 A mágica aqui!
  email: string;

  @ApiProperty({
    description: 'Senha do usuário para registro',
    example: 'senha123',
  })
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @IsString()
  senha: string;

  @ApiProperty({
    description: 'Função do usuário (admin, professor, aluno ou responsavel)',
    example: 'aluno',
  })
  @IsNotEmpty({ message: 'Função é obrigatória.' })
  @IsEnum(Funcao, { message: 'Função inválida.' })
  funcao: Funcao;

  // Campos opcionais dependendo do tipo (admin, aluno, professor ou responsável)
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João da Silva',
  })
  @IsOptional()
  @IsString()
  nome: string; // Para Aluno e Responsável

  @ApiProperty({
    description: 'Turma do aluno',
    example: 'Turma A',
  })
  @IsOptional()
  @IsString()
  turma?: string; // Para Aluno

  @ApiProperty({
    description: 'CPF do responsável',
    example: '123.456.789-00',
  })
  @IsOptional()
  @IsString()
  cpf?: string; // Para Responsável

  @ApiProperty({
    description: 'Telefone do responsável',
    example: '(11) 98765-4321',
  })
  @IsOptional()
  @IsString()
  telefone?: string; // Para Responsável

  @ApiProperty({
    description: 'Matrícula do aluno',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  matricula?: string; // Para Aluno
}
