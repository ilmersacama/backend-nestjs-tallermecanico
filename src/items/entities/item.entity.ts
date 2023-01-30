import { Unit } from './../../units/entities/unit.entity';
import { Category } from './../../categories/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.items, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  //@JoinColumn()
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Category;

  @ManyToOne(() => Unit, (unit) => unit.items, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'unitId', referencedColumnName: 'id' })
  unit: Unit;

  @Column({ unique: true, length: 255 })
  barcode: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ length: 255 })
  description: string;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
