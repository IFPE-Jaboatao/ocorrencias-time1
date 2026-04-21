import { Tipo } from '../enums/tipo-usuario.enum';

export class CreateUsuarioDto {
  login: string;
  senha: string;
  email: string;
  tipo: Tipo;
}
