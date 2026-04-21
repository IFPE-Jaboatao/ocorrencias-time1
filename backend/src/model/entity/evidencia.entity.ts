import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Ocorrencia } from './ocorrencia.entity';

@Entity()
export class Evidencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: false })
  arquivo: string;

  @ManyToOne(() => Ocorrencia, (oc) => oc.evidencias)
  ocorrencia: Ocorrencia;
}
