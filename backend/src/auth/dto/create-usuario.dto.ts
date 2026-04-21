import { Tipo } from '../enums/funcao-usuario.enum';

export class CreateUsuarioDto {
  login: string;
  senha: string;
  email: string;
  tipo: Tipo;
}
