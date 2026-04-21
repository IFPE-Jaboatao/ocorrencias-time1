import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Responsavel } from 'src/responsavel/responsavel.entity';
import { Usuario } from 'src/usuario/usuario.entity';

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
