import { SetMetadata } from '@nestjs/common';

export const FUNCOES_KEY = 'funcoes';
export const Funcoes = (...funcoes: string[]) =>
  SetMetadata(FUNCOES_KEY, funcoes);
