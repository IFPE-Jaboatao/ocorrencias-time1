import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evidencia } from './evidencia.entity';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class EvidenciaService {
  constructor(
    @InjectRepository(Evidencia)
    private readonly evidenciaRepository: Repository<Evidencia>,
  ) {}

  async findAll(): Promise<Evidencia[]> {
    return this.evidenciaRepository.find();
  }

  async findOneById(id: number): Promise<Evidencia | null> {
    return this.evidenciaRepository.findOneBy({ id });
  }

  async create(evidencia: Partial<Evidencia>): Promise<Evidencia> {
    const newEvidencia = this.evidenciaRepository.create(evidencia);
    return this.evidenciaRepository.save(newEvidencia);
  }

  async update(evidencia: Partial<Evidencia>): Promise<Evidencia | null> {
    await this.evidenciaRepository.update(evidencia.id, evidencia);
    return this.evidenciaRepository.findOneBy({ id: evidencia.id });
  }
  getFilePath(filepath: string): string {
    const filePath = join(process.cwd(), 'uploads', filepath);
    //verifica se o arquivo existe na pasta
    if (!existsSync(filePath)) {
      throw new NotFoundException(
        //tratamento de erro
        `O arquivo com path igual a "${filepath}" não foi encontrado no sistema`,
      );
    }
    return filePath;
  }
}
