import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from './comentario.entity';

@Injectable()
export class ComentarioService {
  constructor(
    @InjectRepository(Comentario)
    private readonly comentarioRepository: Repository<Comentario>,
  ) {}

  async findAll(): Promise<Comentario[]> {
    return this.comentarioRepository.find();
  }

  async findOne(id: number): Promise<Comentario | null> {
    return this.comentarioRepository.findOneBy({ id });
  }

  async create(comentario: Partial<Comentario>): Promise<Comentario> {
    const newComentario = this.comentarioRepository.create(comentario);
    return this.comentarioRepository.save(newComentario);
  }

  async update(comentario: Partial<Comentario>): Promise<Comentario | null> {
    await this.comentarioRepository.update(comentario.id, comentario);
    return this.comentarioRepository.findOneBy({ id: comentario.id });
  }
}
