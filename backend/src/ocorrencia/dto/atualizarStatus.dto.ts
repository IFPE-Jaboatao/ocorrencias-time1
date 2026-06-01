import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StatusOcorrencia } from '../enum/statusOcorrencia.enum';

export class AtualizarStatusDto {
  @ApiProperty({
    description: 'Novo status da ocorrência',
    example: 'Resolvida',
  })
  @IsNotEmpty({ message: 'O novo status é obrigatório.' })
  @IsEnum(StatusOcorrencia, { message: 'Status inválido.' })
  status: StatusOcorrencia;
}
