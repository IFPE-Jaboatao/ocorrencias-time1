import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { StringValue } from 'ms';
import { Usuario } from '../usuario/usuario.entity';
import { AlunoModule } from 'src/aluno/aluno.module';
import { ResponsavelModule } from 'src/responsavel/responsavel.module';
import { TurmaModule } from 'src/turma/turma.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    AlunoModule,
    ResponsavelModule,
    PassportModule,
    TurmaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || '',
        signOptions: {
          expiresIn: configService.get<StringValue>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
