import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FiltroOcorrenciaDto {
  @ApiProperty({
    description: 'Nome do aluno para filtrar ocorrências',
    example: 'João da Silva',
  })
  @IsOptional()
  @IsString()
  nome_aluno?: string;

  @ApiProperty({
    description: 'Turma do aluno para filtrar ocorrências',
    example: 'Turma A',
  })
  @IsOptional()
  @IsString()
  turma?: string;

  @ApiProperty({
    description: 'Data da ocorrência para filtrar',
    example: '2023-10-10',
  })
  @IsNotEmpty({ message: 'A data de ocorrência é obrigatória.' })
  @IsDate({ message: 'A data de ocorrência deve ser uma data válida.' })
  data_ocorrencia: Date;
}
