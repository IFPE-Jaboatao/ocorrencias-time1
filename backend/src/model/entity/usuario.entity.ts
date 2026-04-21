import { Tipo } from 'src/enums/tipo-usuario.enum';

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  login: string;

  @Column({ nullable: false })
  senha: string;

  @Column({ nullable: false })
  email: string;

  @Column({
    type: 'enum',
    enum: Tipo,
    nullable: false,
  })
  tipo: Tipo;

  @Column({ default: true })
  status: boolean; // Ativo/Inativo
}
