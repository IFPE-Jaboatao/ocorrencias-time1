import { IsOptional, IsDateString, IsInt, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { StatusOcorrencia } from '../enum/statusOcorrencia.enum';
import { Severidade } from '../enum/severidade.enum';

export class ListarOcorrenciaDto {
  @ApiProperty({
    description: 'Status da ocorrência para filtrar',
    example: 'Aberta',
  })
  @IsOptional()
  @IsEnum(StatusOcorrencia, {
    message:
      'Status inválido. Use Aberta, Em Acompanhamento, Resolvida ou Arquivada',
  })
  status?: StatusOcorrencia;

  @ApiProperty({
    description: 'ID do aluno para filtrar ocorrências',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'o Id do aluno deve ser um número inteiro' })
  alunoId?: number;

  @ApiProperty({
    description: 'Severidade da ocorrência para filtrar',
    example: 'Alta',
    required: false,
    enum: Severidade,
  })
  @IsOptional()
  @IsEnum(Severidade, {
    message: 'Severidade inválida, Use Baixa, Média ou Alta',
  })
  severidade?: Severidade;

  @ApiProperty({
    description: 'Data da ocorrência para filtrar (formato AAAA-MM-DD)',
    example: '2023-10-10',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data inválida. Use o formato AAAA-MM-DD' })
  data?: string;

  @ApiProperty({
    description:
      'ID da turma envolvida na ocorrência (se aplicável) para filtrar por turma',
    example: '1',
  })
  @IsOptional()
  @Type(() => Number)
  turmaId?: number | null;

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
