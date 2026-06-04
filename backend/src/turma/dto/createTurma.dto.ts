import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Turno } from '../enum/turno.enum';
import { Transform } from 'class-transformer';

export class TurmaDto {
  @ApiProperty({
    description: 'Serie da turma (ex: 1, 2, 3, etc.)',
    example: 1,
  })
  @IsNotEmpty({ message: 'Serie é obrigatória.' })
  @IsNumber()
  serie: number;

  @ApiProperty({
    description: 'Turma da turma (ex: A, B, C, etc.)',
    example: 'A',
  })
  @IsNotEmpty({ message: 'Turma é obrigatória.' })
  @IsString()
  @Transform(({ value }) => value.toUpperCase()) // Transforma a turma para maiúscula
  turma: string;

  @ApiProperty({
    description: 'Turno da turma (ex: manha, tarde, noite)',
    example: 'manha',
  })
  @IsNotEmpty({ message: 'Turno é obrigatório.' })
  @IsEnum(Turno, { message: 'Turno inválido.' })
  turno: Turno;
}
