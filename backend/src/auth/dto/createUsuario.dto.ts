import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsEmail,
  IsNumber,
  Length,
  IsPhoneNumber,
  Matches,
} from 'class-validator';
import { Funcao } from '../enums/funcaoUsuario.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email do usuário para registro',
    example: 'usuario@example.com',
  })
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @IsEmail({}, { message: 'O e-mail informado não tem um formato válido.' })
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

  @ApiProperty({
    description: 'Nome do usuário (admin, professor, aluno ou responsável)',
    example: 'João da Silva',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'ID da turma para aluno',
    example: '1',
  })
  @IsOptional()
  @IsNumber()
  turmaId?: number;

  @ApiProperty({
    description: 'CPF para admin, professor, aluno ou responsavel',
    example: '12345678911',
  })
  @IsNumber()
  @Length(11, 11)
  cpf?: number;

  @ApiProperty({
    description: 'Telefone do responsável',
    example: '81999999999',
  })
  @IsOptional()
  @Matches(/^\d{11}$/)
  @IsString()
  telefone?: string;

  @ApiProperty({
    description: 'Matrícula do professor ou aluno',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  matricula?: string;
}
