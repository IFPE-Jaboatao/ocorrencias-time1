import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário para autenticação',
    example: 'usuario@example.com',
  })
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário para autenticação',
    example: 'senha123',
  })
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @IsString()
  senha: string;
}
