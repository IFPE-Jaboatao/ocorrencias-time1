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
import { Usuario } from 'src/usuario/usuario.entity';
@Entity('responsavel')
export class Responsavel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  telefone: string;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @ManyToMany(() => Aluno, (aluno) => aluno.responsaveis)
  alunos: Aluno[];
  @JoinTable()
  aluno: Aluno[];
}
