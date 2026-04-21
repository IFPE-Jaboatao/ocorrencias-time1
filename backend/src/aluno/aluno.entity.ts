import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Responsavel } from 'src/responsavel/responsavel.entity';
import { Usuario } from 'src/auth/usuario.entity';

@Entity()
export class Aluno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: false })
  matricula: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  turma: string;

  @OneToOne(() => Usuario)
  @JoinColumn()
  usuario: Usuario;

  @ManyToOne(() => Responsavel, (res) => res.alunos, { nullable: true })
  responsavel: Responsavel;
}
