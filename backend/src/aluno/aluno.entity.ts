import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
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

  @ManyToMany(() => Responsavel, (res) => res.alunos)
  @JoinTable({
    name: 'aluno_responsavel', // nome da tabela intermediária
    joinColumn: {
      name: 'aluno_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'responsavel_id',
      referencedColumnName: 'id',
    },
  }) // cria a tabela intermediária automaticamente
  responsaveis: Responsavel[];
}
