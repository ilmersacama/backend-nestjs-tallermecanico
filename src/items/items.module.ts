import { Unit } from './../units/entities/unit.entity';
import { Category } from './../categories/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { Item } from './entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Category, Unit])],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
