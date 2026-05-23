import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

import { Aluno } from 'src/aluno/aluno.entity';
import { Evidencia } from 'src/evidencia/evidencia.entity';
import { Usuario } from 'src/auth/usuario.entity';
import { Severidade } from './enum/severidade.enum';
import { StatusOcorrencia } from './enum/statusOcorrencia.enum';
import { CategoriaOcorrencia } from './enum/categoria.enum';

@Entity('ocorrencia')
export class Ocorrencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: CategoriaOcorrencia,
    default: CategoriaOcorrencia.CONDUTA_INDISCIPLINAR,
  })
  categoria: CategoriaOcorrencia;

  @Column({ type: 'enum', enum: Severidade, default: Severidade.MEDIA })
  severidade: Severidade;

  @Column({
    type: 'enum',
    enum: StatusOcorrencia,
    default: StatusOcorrencia.ABERTA,
  })
  status: StatusOcorrencia;

  @Column({ type: 'text', nullable: true })
  titulo: string;

  @Column('text')
  descricao: string;

  @CreateDateColumn()
  dataCriacao: Date;

  @Column({ nullable: true })
  dataOcorrencia: Date;

  @Column({ nullable: true, default: false })
  ciencia: boolean;

  @ManyToOne(() => Aluno, (aluno) => aluno.ocorrencias)
  @JoinColumn({ name: 'alunoId' })
  aluno: Aluno;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'autorId' })
  autor: Usuario;

  @OneToMany(() => Evidencia, (ev) => ev.ocorrencia)
  evidencias: Evidencia[];
}
