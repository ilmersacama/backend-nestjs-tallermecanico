import { Unit } from './../units/entities/unit.entity';
import { Category } from './../categories/entities/category.entity';
import { Item } from './entities/item.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Unit) private unitRepository: Repository<Unit>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async createItem(item: CreateItemDto) {
    const category = await this.categoryRepository.findOneBy({
      id: item.categoryId,
    });
    const unit = await this.unitRepository.findOneBy({
      id: item.unitId,
    });
    const product = this.itemRepository.create(item);
    product.category = category;
    product.unit = unit;
    const datasuccess = await this.itemRepository.save(product);
    //console.log(datasuccess);
    return new HttpException(
      `Item created success ${datasuccess}`,
      HttpStatus.CREATED,
    );

    // const datasuccess = await this.itemRepository
    //   .createQueryBuilder()
    //   .insert()
    //   .into(Item)
    //   .values({
    //     ...item,
    //     category: {
    //       id: item.categoryId,
    //     },
    //     unit: {
    //       id: item.unitId,
    //     },
    //   })
    //   .execute();
    // //console.log(datasuccess);
    // return new HttpException(
    //   `Item created success ${datasuccess}`,
    //   HttpStatus.CREATED,
    // );
  }

  async getItems() {
    // const items = await this.itemRepository.find({
    //   relations: ['category', 'unit'],
    // });
    // return { items };

    const items = await this.dataSource
      .getRepository(Item)
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .leftJoinAndSelect('item.unit', 'unit')
      .select([
        'item.id',
        'item.barcode',
        'item.name',
        'item.description',
        'item.image',
        'category.category',
        'unit.unit',
      ])
      .getRawMany();
    //console.log(items);
    return items;
  }

  async getItem(id: number) {
    const item = await this.dataSource
      .getRepository(Item)
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .leftJoinAndSelect('item.unit', 'unit')
      .select([
        'item.id as id',
        'item.barcode as barcode',
        'item.name as name',
        'item.description as description',
        'item.image as image',
        'category.id as categoryId',
        'unit.id as unitId',
      ])
      .where('item.id = :id', { id: id })
      .getRawOne();
    //console.log(item);
    return item;
  }

  async updateItem(id: number, item: UpdateItemDto) {
    const itemFound = await this.itemRepository.findOne({
      where: {
        id: id,
      },
    });
    //console.log(itemFound);
    if (!itemFound) {
      return new HttpException('Item not found', HttpStatus.NOT_FOUND);
    }

    const category = await this.categoryRepository.findOneBy({
      id: item.categoryId,
    });
    const unit = await this.unitRepository.findOneBy({
      id: item.unitId,
    });
    const product = this.itemRepository.create(item);
    product.category = category;
    product.unit = unit;
    const datasuccess = await this.itemRepository.update(id, product);
    //console.log(datasuccess);
    return new HttpException(
      `Success update ${datasuccess}`,
      HttpStatus.CREATED,
    );
  }

  async deleteItem(id: number) {
    const result = await this.itemRepository.delete({ id });
    if (result.affected === 0) {
      //throw new NotFoundException('User not found');
      return new HttpException('Item not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
