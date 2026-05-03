import {
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StatusOcorrencia } from '../ocorrencia.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ListarOcorrenciaDto {
  @ApiProperty({
    description: 'Status da ocorrência para filtrar',
    example: 'Aberta',
  })
  @IsOptional()
  @IsEnum(StatusOcorrencia, {
    message:
      'Status inválido. Use ABERTA, EM_ACOMPANHAMENTO, RESOLVIDA ou ARQUIVADA',
  })
  status?: StatusOcorrencia;

  @ApiProperty({
    description: 'ID do aluno para filtrar ocorrências',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  id_aluno?: string;

  @ApiProperty({
    description: 'Severidade da ocorrência para filtrar',
    example: 'Alta',
  })
  @IsOptional()
  @IsString()
  severidade?: string;

  @ApiProperty({
    description: 'Data da ocorrência para filtrar (formato AAAA-MM-DD)',
    example: '2023-10-10',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data inválida. Use o formato AAAA-MM-DD' })
  data?: string;

  @ApiProperty({
    description: 'Turma do aluno para filtrar ocorrências',
    example: 'Turma A',
  })
  @IsOptional()
  @IsString()
  turma?: string;

  @ApiProperty({
    description: 'Campo de busca para descrição da ocorrência',
    example: 'problema no computador',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    description: 'quantidade de ocorrências a serem retornadas por página',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiProperty({
    description: 'quantidade de ocorrências a serem retornadas por página',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;
}
