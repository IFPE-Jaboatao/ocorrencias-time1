import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class VincularAlunoResponsavelDto {
  @ApiProperty({
    description: 'ID do aluno para autenticação',
    example: 1,
  })
  @IsNotEmpty({ message: 'alunoId é obrigatório.' })
  @IsNumber()
  alunoId: number;

  @ApiProperty({
    description: 'ID do responsável para autenticação',
    example: 1,
  })
  @IsNotEmpty({ message: 'responsavelId é obrigatório.' })
  @IsNumber()
  responsavelId: number;
}
