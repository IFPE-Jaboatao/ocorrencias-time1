import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Turno } from './enum/turno.enum';

@Entity('turma')
export class Turma {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  serie: number; // ex.: 1 -> primeiro

  @Column({
    nullable: false,
    transformer: {
      to: (value: string) => value?.toUpperCase(), // Transforma em maiúsculo ao salvar
      from: (value: string) => value, // Mantém igual ao ler do banco
    },
  })
  turma: string; // ex.: A

  @Column({
    type: 'enum',
    enum: Turno,
    nullable: false,
  })
  turno: Turno;
}
