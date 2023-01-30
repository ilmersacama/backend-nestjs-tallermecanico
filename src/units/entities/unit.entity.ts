import { Item } from './../../items/entities/item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'units' })
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  unit: string;

  @Column({ length: 255 })
  description: string;

  @OneToMany(() => Item, (item) => item.unit, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  public items: Item[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
