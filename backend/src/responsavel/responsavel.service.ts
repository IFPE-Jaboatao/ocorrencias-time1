import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Responsavel } from './responsavel.entity';

@Injectable()
export class ResponsavelService {
  constructor(
    @InjectRepository(Responsavel)
    private readonly responsavelRepository: Repository<Responsavel>,
  ) {}

  async findAll(): Promise<Responsavel[]> {
    return this.responsavelRepository.find();
  }

  async findOne(id: number): Promise<Responsavel | null> {
    return this.responsavelRepository.findOneBy({ id });
  }

  async create(responsavel: Partial<Responsavel>): Promise<Responsavel> {
    const newResponsavel = this.responsavelRepository.create(responsavel);
    return this.responsavelRepository.save(newResponsavel);
  }

  async update(responsavel: Partial<Responsavel>): Promise<Responsavel | null> {
    await this.responsavelRepository.update(responsavel.id, responsavel);
    return this.responsavelRepository.findOneBy({ id: responsavel.id });
  }
}
