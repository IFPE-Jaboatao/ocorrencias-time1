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

  async findOne(id: number): Promise<Evidencia | null> {
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
  getFilePath(filename: string): string {
    const filePath = join(process.cwd(), 'uploads', filename);
    //verifica se o arquivo existe na pasta
    if (!existsSync(filePath)) {
      throw new NotFoundException(
        //tratamento de erro
        `O arquivo: ${filename} não foi encontrado no sistema`,
      );
    }
    return filePath;
  }
}
