import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Responsavel } from 'src/responsavel/responsavel.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { Ocorrencia } from 'src/ocorrencia/ocorrencia.entity';
import { Turma } from 'src/turma/turma.entity';
@Entity('aluno')
export class Aluno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  matricula: string;

  @ManyToOne(() => Turma)
  @JoinColumn({ name: 'turmaId' })
  turma: Turma;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @ManyToMany(() => Responsavel, (res) => res.alunos)
  @JoinTable({
    name: 'aluno_responsavel',
    joinColumn: {
      name: 'alunoId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'responsavelId',
      referencedColumnName: 'id',
    },
  })
  responsaveis: Responsavel[];

  @OneToMany(() => Ocorrencia, (ocorrencia) => ocorrencia.aluno)
  ocorrencias: Ocorrencia[];
}
