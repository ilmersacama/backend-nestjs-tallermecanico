import { Category } from './entities/category.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createCategory(category: CreateCategoryDto) {
    const categoryFound = await this.categoryRepository.findOne({
      where: {
        category: category.category,
      },
    });
    if (categoryFound) {
      return new HttpException('Category already exists¡', HttpStatus.CONFLICT);
    }
    const newCategory = this.categoryRepository.create(category);
    const dataSuccess = await this.categoryRepository.save(newCategory);
    return new HttpException(
      `Category created success ${dataSuccess}`,
      HttpStatus.CREATED,
    );
  }

  async getCategories() {
    const categories = await this.categoryRepository.find();
    return { categories };
  }

  async getCategory(id: number) {
    const categoryFound = await this.categoryRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!categoryFound) {
      return new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return categoryFound;
  }

  async updateCategory(id: number, category: UpdateCategoryDto) {
    const categoryFound = await this.categoryRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!categoryFound) {
      return new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    const dataSuccess = await this.categoryRepository.update(id, category);
    return new HttpException(
      `Success update ${dataSuccess}`,
      HttpStatus.CREATED,
    );
  }

  async deleteCategory(id: number) {
    const result = await this.categoryRepository.delete({ id });
    if (result.affected === 0) {
      //throw new NotFoundException('User not found');
      return new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
