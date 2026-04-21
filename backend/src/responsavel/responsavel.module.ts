import { Module } from '@nestjs/common';
import { ResponsavelService } from './responsavel.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Responsavel } from './responsavel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Responsavel])],
  providers: [ResponsavelService],
})
export class ResponsavelModule {}
