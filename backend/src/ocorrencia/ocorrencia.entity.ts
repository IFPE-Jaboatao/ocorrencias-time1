import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Aluno } from 'src/aluno/aluno.entity';
import { Comentario } from 'src/comentario/comentario.entity';
import { Evidencia } from 'src/evidencia/evidencia.entity';
import { Usuario } from 'src/usuario/usuario.entity';

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_ocorrencia: Date;

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
