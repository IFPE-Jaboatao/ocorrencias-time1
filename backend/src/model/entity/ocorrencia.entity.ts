import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Usuario } from './usuario.entity';
import { Aluno } from './aluno.entity';
import { Comentario } from './comentario.entity';
import { Evidencia } from './evidencia.entity';

@Entity()
export class Ocorrencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo_ocorrencia: string;

  @Column()
  severidade: string;

  @Column('text')
  descricao: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_criacao: Date;

  @Column({ nullable: true, default: false })
  ciencia: boolean;

  @ManyToOne(() => Aluno)
  aluno: Aluno;

  @ManyToOne(() => Usuario)
  autor: Usuario;

  @OneToMany(() => Evidencia, (ev) => ev.ocorrencia)
  evidencias: Evidencia[];

  @OneToMany(() => Comentario, (com) => com.ocorrencia)
  comentarios: Comentario[];
}
