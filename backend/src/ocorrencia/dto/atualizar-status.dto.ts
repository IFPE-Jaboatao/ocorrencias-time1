import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
  Matches,
} from 'class-validator';
import { StatusOcorrencia } from '../ocorrencia.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AtualizarStatusDto {
  @ApiProperty({
    description: 'Novo status da ocorrência',
    example: 'Resolvida',
  })
  @IsNotEmpty({ message: 'O novo status é obrigatório.' })
  @IsEnum(StatusOcorrencia, { message: 'Status inválido.' })
  status: StatusOcorrencia;

  @ApiPropertyOptional({
    description: 'Justificativa para a alteração de status',
    example: 'O problema foi resolvido pelo técnico.',
  })
  //só valida se o status foi definido como 'resolvida'
  @ValidateIf(
    (objeto: AtualizarStatusDto) =>
      objeto.status === StatusOcorrencia.RESOLVIDA,
  )
  //garante que não é vazio ou nulo
  @IsNotEmpty({
    message:
      'A justificativa é obrigatória para resolver, ou alterar, o status de uma ocorrência.',
  })
  //garante que seja tratado com string
  @IsString({ message: 'A justificativa deve ser um texto válido.' })
  //barramento contra digitos numéricos
  @Matches(/^(?!^\s*$).+/, {
    message:
      'A justificativa não pode conter apenas números, espaços etc. Insira uma justificativa válida.',
  })
  @MinLength(5, {
    message: 'A justificativa deve conter pelo menos 5 caracteres',
  })
  justificativa?: string;
}
