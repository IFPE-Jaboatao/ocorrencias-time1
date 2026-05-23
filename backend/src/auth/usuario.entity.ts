import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Funcao } from './enums/funcao-usuario.enum';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  senha: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: Funcao,
    nullable: false,
  })
  funcao: Funcao;
}
