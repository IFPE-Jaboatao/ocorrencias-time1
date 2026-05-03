import {
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StatusOcorrencia } from '../ocorrencia.entity';

export class ListarOcorrenciaDto {
  @IsOptional()
  @IsEnum(StatusOcorrencia, {
    message:
      'Status inválido. Use ABERTA, EM_ACOMPANHAMENTO, RESOLVIDA ou ARQUIVADA',
  })
  status?: StatusOcorrencia;

  @IsOptional()
  @IsString()
  aluno?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data inválida. Use o formato AAAA-MMM-DD' })
  data?: string;

  @IsOptional()
  @IsString()
  turma?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;
}
