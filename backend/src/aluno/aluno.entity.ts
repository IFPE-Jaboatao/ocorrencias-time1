import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany, //importação do decorator para a relação de 1:N
} from 'typeorm';

import { Responsavel } from 'src/responsavel/responsavel.entity';
import { Usuario } from 'src/auth/usuario.entity';
import { Ocorrencia } from 'src/ocorrencia/ocorrencia.entity'; //aqui 'chamamos' a ocorrÊncia para o typeorm saber quem é
//import { Professor } from 'src/professor/professor.entity';
//adicionado o import do professor para criar a relação de aluno x professor quando formos usar
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

  //relação de 1:1 de aluno x usuário
  @OneToOne(() => Usuario)
  @JoinColumn()
  usuario: Usuario;

  //relação N:N de alunos x responsÁveis
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
  //relação de 1:N de aluno x ocorrências
  @OneToMany(() => Ocorrencia, (ocorrencia) => ocorrencia.aluno)
  ocorrencias: Ocorrencia[];
  //relação de N:N de alunos x professores
//  @ManyToMany(() => Professor, (professor) => professor.alunos)
//  professores: Professor[];
}
