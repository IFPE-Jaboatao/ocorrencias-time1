import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusOcorrencia } from '../ocorrencia.entity';

export class AtualizarStatusDto {
  @IsNotEmpty({ message: 'O novo status é obrigatório.' })
  @IsEnum(StatusOcorrencia, { message: 'Status inválido.' })
  status: StatusOcorrencia;

  @IsOptional()
  @IsString()
  justificativa?: string;
}
