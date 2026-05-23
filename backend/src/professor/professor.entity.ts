import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';

import { Usuario } from '../auth/usuario.entity';
import { Aluno } from '../aluno/aluno.entity';

@Entity('professor')
export class Professor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: false, unique: true })
  matricula: string;

  @Column({ nullable: false })
  departamento: string;

  @OneToOne(() => Usuario)
  @JoinColumn()
  usuario: Usuario;

  @ManyToMany(() => Aluno, (aluno) => aluno.professores)
  alunos: Aluno[];
}
