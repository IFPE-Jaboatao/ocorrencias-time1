import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @IsString()
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @IsString()
  senha: string;
}
