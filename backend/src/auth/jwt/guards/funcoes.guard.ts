import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { FUNCOES_KEY } from '../decorators/funcoes.decorator';

@Injectable()
export class FuncoesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredFuncoes = this.reflector.getAllAndOverride<string[]>(
      FUNCOES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredFuncoes) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!requiredFuncoes.includes(user.funcao)) {
      throw new ForbiddenException(
        'O seu perfil não tem permissão para acessar este recurso',
      );
    }

    return true;
  }
}
