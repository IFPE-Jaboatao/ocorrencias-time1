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
import { Usuario } from 'src/usuario/usuario.entity';
import { Severidade } from './enum/severidade.enum';
import { StatusOcorrencia } from './enum/statusOcorrencia.enum';
import { Turma } from 'src/turma/turma.entity';

@Entity('ocorrencia')
export class Ocorrencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  categoria: string;

  @Column({ type: 'enum', enum: Severidade, default: Severidade.MEDIA })
  severidade: Severidade;

  @Column({
    type: 'enum',
    enum: StatusOcorrencia,
    default: StatusOcorrencia.ABERTA,
  })
  status: StatusOcorrencia;

  @Column({ nullable: false })
  titulo: string;

  @Column()
  descricao: string;

  @CreateDateColumn()
  dataCriacao: Date;

  @Column({ nullable: true })
  dataOcorrencia: Date;

  @Column({ nullable: true, default: false })
  ciencia: boolean;

  @ManyToOne(() => Aluno)
  @JoinColumn({ name: 'alunoId' })
  aluno: Aluno;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'autorId' })
  autor: Usuario;

  @OneToMany(() => Evidencia, (ev) => ev.ocorrencia)
  evidencias: Evidencia[];

  @ManyToOne(() => Turma)
  @JoinColumn({ name: 'turmaId' })
  turma: Turma | null; // REGRA DE NEGÓCIO: a ocorrência pode ter envolvimento de uma turma ou não
}
