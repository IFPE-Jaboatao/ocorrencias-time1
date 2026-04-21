import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { Aluno } from 'src/aluno/aluno.entity';
import { Usuario } from 'src/auth/usuario.entity';
@Entity()
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
  usuario: Usuario;

  @OneToMany(() => Aluno, (aluno) => aluno.responsavel)
  alunos: Aluno[];
}
