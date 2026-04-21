import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Aluno } from 'src/aluno/aluno.entity';
import { Usuario } from 'src/usuario/usuario.entity';

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

  @ManyToOne(() => Usuario)
  usuario: Usuario;

  @OneToMany(() => Aluno, (aluno) => aluno.responsavel)
  alunos: Aluno[];
}
