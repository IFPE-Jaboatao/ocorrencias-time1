import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusOcorrencia } from '../ocorrencia.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizarStatusDto {
  @ApiProperty({
    description: 'Novo status da ocorrência',
    example: 'Resolvida',
  })
  @IsNotEmpty({ message: 'O novo status é obrigatório.' })
  @IsEnum(StatusOcorrencia, { message: 'Status inválido.' })
  status: StatusOcorrencia;

  @ApiProperty({
    description: 'Justificativa para a alteração de status',
    example: 'O problema foi resolvido pelo técnico.',
  })
  @IsOptional()
  @IsString()
  justificativa?: string;
}
