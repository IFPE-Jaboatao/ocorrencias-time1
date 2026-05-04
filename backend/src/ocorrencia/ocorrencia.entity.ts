import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

import { Aluno } from 'src/aluno/aluno.entity';
import { Comentario } from 'src/comentario/comentario.entity';
import { Evidencia } from 'src/evidencia/evidencia.entity';
import { Usuario } from 'src/auth/usuario.entity';

//adicioonado enum para 'blindar' o banco de dados, impede que
//o frontend envie severidade ou status com erros de digitação
export enum Severidade {
  BAIXA = 'Baixa',
  MEDIA = 'Media',
  ALTA = 'Alta',
}

export enum StatusOcorrencia {
  ABERTA = 'Aberta',
  EM_ACOMPANHAMENTO = 'Em Acompanhamento',
  RESOLVIDA = 'Resolvida',
  ARQUIVADA = 'Arquivada',
}
@Entity('Ocorrencia')
export class Ocorrencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() //alterado para categoria para estar alinhado com o modelo de dados do pdf e com o payload
  categoria: string;

  @Column({ nullable: true })
  contexto: string; //adicionado o campo de contexto por requisição da jornada 1.1 no formulário de criação de ocoRrencia
  //alterado para garantir que severidade só aceite baixa, média ou alta
  @Column({ type: 'enum', enum: Severidade, default: Severidade.MEDIA })
  severidade: Severidade;
  //adicionado status para conformidade com a jornada 1.2--> atualizar status de ocorrência, o padrão é sempre 'aberta'
  @Column({
    type: 'enum',
    enum: StatusOcorrencia,
    default: StatusOcorrencia.ABERTA,
  })
  status: StatusOcorrencia;

  @Column({ type: 'text', nullable: true })
  justificativa: string; //adicionado campo para justificar a alteração do status de uma ocorrência

  @Column('text')
  descricao: string;
  //alternado para usar o decorator nativo de timestamp do typeorm para datas automáticas
  //garante que o CreateDateColumn já gerencie a inserção de data de criação por si so
  @CreateDateColumn()
  data_criacao: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_ocorrencia: Date;

  @Column({ nullable: true, default: false })
  ciencia: boolean;
  //alterado para relacionamento bidirecional 2 joincoLumn
  //assim o aluno.ocorrencias fecha a via de mão dupla para o endpoint do responsavel funcionar
  @ManyToOne(() => Aluno, (aluno) => aluno.ocorrencias)
  @JoinColumn({ name: 'aluno_id' })
  aluno: Aluno;
  //adição do JoinColumn
  //evita que o typeorm ccrie colunas com nomes confusos
  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'autor_id' })
  autor: Usuario;

  @OneToMany(() => Evidencia, (ev) => ev.ocorrencia)
  evidencias: Evidencia[];

  @OneToMany(() => Comentario, (com) => com.ocorrencia)
  comentarios: Comentario[];
}
