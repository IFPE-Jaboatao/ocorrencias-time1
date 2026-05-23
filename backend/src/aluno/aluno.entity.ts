import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { Responsavel } from 'src/responsavel/responsavel.entity';
import { Usuario } from 'src/auth/usuario.entity';
import { Ocorrencia } from 'src/ocorrencia/ocorrencia.entity';
import { Professor } from 'src/professor/professor.entity';
@Entity('aluno')
export class Aluno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: false, unique: true })
  matricula: string;

  @Column({ nullable: false })
  turma: string;

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
  @ManyToMany(() => Professor, (professor) => professor.alunos)
  professores: Professor[];
}
