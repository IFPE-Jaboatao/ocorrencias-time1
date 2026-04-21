import { Tipo } from '../enums/tipo-usuario.enum';

export class UpdateUsuarioDto {
  id: number;
  senha: string;
  email: string;
}
