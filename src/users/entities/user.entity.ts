import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum roles {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  USER = 'user',
  SELLER = 'seller',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 200 })
  password: string;

  @Column({
    type: 'enum',
    enum: roles,
    default: roles.ADMIN,
  })
  role: roles;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
