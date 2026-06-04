import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Ocorrencia } from 'src/ocorrencia/ocorrencia.entity';

@Entity('evidencia')
export class Evidencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  path: string;

  @ManyToOne(() => Ocorrencia, (oc) => oc.evidencias)
  ocorrencia: Ocorrencia;
}
