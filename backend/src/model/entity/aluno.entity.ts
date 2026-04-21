import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Usuario } from './usuario.entity';
import { Responsavel } from './responsavel.entity';

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

  @ManyToOne(() => Usuario)
  usuario: Usuario;

  @ManyToOne(() => Responsavel, (res) => res.alunos)
  responsavel: Responsavel;
}
