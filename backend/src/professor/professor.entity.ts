import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Usuario } from '../usuario/usuario.entity';

@Entity('professor')
export class Professor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  matricula: string;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;
}
