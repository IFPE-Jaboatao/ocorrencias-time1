import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Turno } from './enum/turno.enum';

@Entity('turma')
export class Turma {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  serie: number; // ex.: 1 -> primeiro

  @Column({ nullable: false })
  turma: string; // ex.: A

  @Column({
    type: 'enum',
    enum: Turno,
    nullable: false,
  })
  turno: Turno;
}
