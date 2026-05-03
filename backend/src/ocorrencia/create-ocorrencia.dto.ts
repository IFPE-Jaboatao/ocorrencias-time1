import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Severidade } from 'src/ocorrencia/ocorrencia.entity';

//criação das 'proteções' contra entradas de dados incorretas e avisos
export class CreateOcorrenciaDto {
  @IsNumber()
  @IsNotEmpty({ message: 'o ID do aluno é obrigatório' })
  alunoId: number;

  @IsString()
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  categoria: string;

  @IsEnum(Severidade, { message: 'A severidade deve ser baixa, média ou alta' })
  @IsNotEmpty({ message: 'A severidade é obrigatória' })
  severidade: Severidade;

  @IsString()
  @IsNotEmpty({ message: 'A descrição da ocorrência é obrigatória' })
  descricao: string;

  @IsString()
  @IsOptional()
  contexto?: string;
}
