import { Item } from './../../items/entities/item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  category: string;

  @Column({ length: 255 })
  description: string;

  @OneToMany(() => Item, (item: Item) => item.category, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  public items: Item[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
