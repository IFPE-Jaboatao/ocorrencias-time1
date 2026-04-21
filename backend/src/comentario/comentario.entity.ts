import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Ocorrencia } from 'src/ocorrencia/ocorrencia.entity';
import { Usuario } from 'src/usuario/usuario.entity';

@Entity()
export class Comentario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  texto: string;

  @Column({ nullable: false })
  arquivo: string;

  @Column({ nullable: false })
  data: Date;

  @Column({ nullable: false })
  visibilidade: string;

  @ManyToOne(() => Usuario)
  autor: Usuario;

  @ManyToOne(() => Ocorrencia, (oc) => oc.comentarios)
  ocorrencia: Ocorrencia;
}
