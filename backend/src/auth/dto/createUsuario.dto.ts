import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsEmail,
  IsNumber,
  Length,
  IsPhoneNumber,
} from 'class-validator';
import { Funcao } from '../enums/funcaoUsuario.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'OBRIGATÓRIO: Email do usuário para registro',
    example: 'usuario@example.com',
  })
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @IsEmail({}, { message: 'O e-mail informado não tem um formato válido.' })
  email: string;

  @ApiProperty({
    description: 'OBRIGATÓRIO: Senha do usuário para registro',
    example: 'senha123',
  })
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @IsString()
  senha: string;

  @ApiProperty({
    description: 'OBRIGATÓRIO: Função do usuário',
    example: 'aluno',
  })
  @IsNotEmpty({ message: 'Função é obrigatória.' })
  @IsEnum(Funcao, { message: 'Função inválida.' })
  funcao: Funcao;

  @ApiProperty({
    description: 'OBRIGATÓRIO: Nome do usuário',
    example: 'João da Silva',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'OPCIONAL(apenas para aluno): ID da turma para aluno',
    example: '1',
  })
  @IsOptional()
  @IsNumber()
  turmaId?: number;

  @ApiProperty({
    description: 'OBRIGATÓRIO: CPF para admin, professor, aluno ou responsavel',
    example: '12345678911',
  })
  @IsString()
  @Length(11, 11, { message: 'CPF deve conter 11 dígitos.' })
  cpf: string;

  @ApiProperty({
    description: 'OPCIONAL(apenas para responsável): Telefone do responsável',
    example: '+5581900000000',
  })
  @IsOptional()
  @IsPhoneNumber('BR', {
    message: 'Número de telefone inválido. Formato esperado: +55XXXXXXXXXXX',
  })
  @IsString()
  telefone?: string;

  @ApiProperty({
    description:
      'OPCIONAL(apenas para professor ou aluno): Matrícula do professor ou aluno',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  matricula?: string;
}
