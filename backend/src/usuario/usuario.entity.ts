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

  @Column({ type: 'varchar', nullable: false, length: 11, unique: false }) // CPF não deve ser único, pois pode haver um usuário que seja responsável e também professor, por exemplo
  cpf: string;

  @Column({
    type: 'enum',
    enum: Funcao,
    nullable: false,
  })
  funcao: Funcao;
}
