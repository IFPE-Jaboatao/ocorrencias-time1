import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Funcao } from '../auth/enums/funcaoUsuario.enum';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  senha: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: false, unique: true })
  cpf: number;

  @Column({
    type: 'enum',
    enum: Funcao,
    nullable: false,
  })
  funcao: Funcao;
}
