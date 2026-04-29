import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';

import { Aluno } from 'src/aluno/aluno.entity';
import { Usuario } from 'src/auth/usuario.entity';
@Entity('responsavel')
export class Responsavel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  telefone: string;

  @Column({ nullable: false })
  cpf: string;

  @OneToOne(() => Usuario)
  @JoinColumn()
  usuario: Usuario;

  @ManyToMany(() => Aluno, (aluno) => aluno.responsaveis)
  alunos: Aluno[];
  @JoinTable()
  aluno: Aluno[]; //adicionado o join table para que ele possa criar a tabela intermediaria
}
