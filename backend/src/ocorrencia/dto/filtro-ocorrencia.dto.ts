import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StatusOcorrencia, Severidade } from '../ocorrencia.entity';

export class FiltroOcorrenciaDto {
  //filtros ajustados
  @ApiPropertyOptional({
    description: 'Turma do aluno para filtrar ocorrências',
    example: 'Turma 1ºA',
  })
  @IsOptional()
  @IsString()
  turma?: string;

  @ApiPropertyOptional({
    description: 'Data da ocorrência para filtrar (formato YYYY-MM-DD)',
    example: '2026-08-20',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'a data de ocorrência deve ser válida no formato (YYYY-MM-DD)' },
  )
  data_ocorrencia?: string;

  //filtos otimizados
  @ApiPropertyOptional({ description: 'ID do aluno para filtrar ocorrências' })
  @IsOptional()
  @Type(() => Number) // Converte o texto da URL para Número
  @IsInt({ message: 'O ID do aluno deve ser um número inteiro.' })
  alunoId?: number;

  @ApiPropertyOptional({
    enum: StatusOcorrencia,
    description: 'Filtrar pelo status da ocorrência',
  })
  @IsOptional()
  @IsEnum(StatusOcorrencia, { message: 'Status inválido.' })
  status?: StatusOcorrencia;

  @ApiPropertyOptional({
    enum: Severidade,
    description: 'Filtrar pela severidade',
  })
  @IsOptional()
  @IsEnum(Severidade, { message: 'Severidade inválida.' })
  severidade?: Severidade;

  @ApiPropertyOptional({
    description: 'Busca por texto na descrição ou nome do aluno',
  })
  @IsOptional()
  @IsString()
  busca?: string; // Substituímos o nome_aluno por um campo de busca geral mais inteligente

  @ApiPropertyOptional({
    description: 'número de página (padrão: 1)',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: ' a página mínima é 1.' })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página (padrão: 10)',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'O limite mínimo é 1.' })
  limit: number = 30;
}
