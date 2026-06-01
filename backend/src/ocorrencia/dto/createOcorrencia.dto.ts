import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsInt,
  IsPositive,
  MaxLength,
} from 'class-validator';
import { Severidade } from '../enum/severidade.enum';
export class CreateOcorrenciaDto {
  @ApiProperty({
    description: 'ID do aluno relacionado à ocorrência',
    example: 1,
  })
  @IsInt({ message: 'O ID do aluno deve ser um número inteiro' })
  @IsPositive({ message: 'O ID do aluno deve ser um número positivo' })
  @IsNotEmpty({ message: 'O ID do aluno é obrigatório' })
  alunoId: number;

  @ApiProperty({
    description: 'Categoria da ocorrência',
    example: 'Conduta indisciplinar',
  })
  @IsString()
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  categoria: string;

  @ApiProperty({
    description: 'Severidade da ocorrência',
    example: Severidade.ALTA,
  })
  @IsEnum(Severidade, {
    message:
      'A severidade deve ser uma das opções válidas (' +
      Object.values(Severidade).join(', ') +
      ')',
  })
  @IsNotEmpty({ message: 'A severidade é obrigatória' })
  severidade: Severidade;

  @ApiProperty({
    description: 'Título da ocorrência',
    example: 'Computador não liga',
  })
  @IsString()
  @MaxLength(2000, {
    message: 'O título não pode ultrapassar 2000 caracteres',
  })
  @IsNotEmpty({ message: 'O título da ocorrência é obrigatório' })
  titulo: string;

  @ApiProperty({
    description: 'Descrição detalhada da ocorrência',
    example: 'O computador não liga e apresenta uma tela azul.',
  })
  @IsString()
  @MaxLength(2000, {
    message: 'A descrição não pode ultrapassar 2000 caracteres',
  })
  @IsNotEmpty({ message: 'A descrição da ocorrência é obrigatória' })
  descricao: string;

  @ApiProperty({
    description:
      'Data e hora em que a ocorrência aconteceu (formato ISO 8601, ex: 2024-06-01T14:30:00Z)',
    example: Date.now(),
  })
  @IsString()
  @IsNotEmpty({ message: 'A data da ocorrência é obrigatória' })
  dataOcorrencia: Date;
}
