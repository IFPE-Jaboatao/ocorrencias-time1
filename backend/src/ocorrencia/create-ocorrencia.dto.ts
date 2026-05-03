import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Severidade } from 'src/ocorrencia/ocorrencia.entity';

//criação das 'proteções' contra entradas de dados incorretas e avisos
export class CreateOcorrenciaDto {
  @ApiProperty({
    description: 'ID do aluno relacionado à ocorrência',
    example: 123456,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'o ID do aluno é obrigatório' })
  alunoId: number;

  @ApiProperty({
    description: 'Categoria da ocorrência',
    example: 'Problema Técnico',
  })
  @IsString()
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  categoria: string;

  @ApiProperty({
    description: 'Severidade da ocorrência',
    example: 'Alta',
  })
  @IsEnum(Severidade, { message: 'A severidade deve ser baixa, média ou alta' })
  @IsNotEmpty({ message: 'A severidade é obrigatória' })
  severidade: Severidade;

  @ApiProperty({
    description: 'Descrição detalhada da ocorrência',
    example: 'O computador não liga e apresenta uma tela azul.',
  })
  @IsString()
  @IsNotEmpty({ message: 'A descrição da ocorrência é obrigatória' })
  descricao: string;

  @ApiProperty({
    description:
      'Contexto adicional ou informações relevantes sobre a ocorrência',
    example: 'O problema começou após uma atualização do sistema.',
  })
  @IsString()
  @IsOptional()
  contexto?: string;
}
