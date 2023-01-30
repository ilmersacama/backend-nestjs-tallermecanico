import { Unit } from './entities/unit.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
  ) {}

  async createUnit(unit: CreateUnitDto) {
    const unitFound = await this.unitRepository.findOne({
      where: {
        unit: unit.unit,
      },
    });
    if (unitFound) {
      return new HttpException('Unit already exists¡', HttpStatus.CONFLICT);
    }
    const newUnit = this.unitRepository.create(unit);
    const dataSuccess = await this.unitRepository.save(newUnit);
    return new HttpException(
      'Unit created success `${dataSuccess}`',
      HttpStatus.CREATED,
    );
  }

  async getUnits() {
    const units = await this.unitRepository.find();
    return { units };
  }

  async getUnit(id: number) {
    const unitFound = await this.unitRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!unitFound) {
      return new HttpException('Unit not found', HttpStatus.NOT_FOUND);
    }
    return unitFound;
  }

  async updateUnit(id: number, unit: UpdateUnitDto) {
    const unitFound = await this.unitRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!unitFound) {
      return new HttpException('Unit not found', HttpStatus.NOT_FOUND);
    }
    const dataSuccess = await this.unitRepository.update(id, unit);
    return new HttpException(
      'Success update `${dataSuccess}`',
      HttpStatus.CREATED,
    );
  }

  async deleteUnit(id: number) {
    const result = await this.unitRepository.delete({ id });
    if (result.affected === 0) {
      //throw new NotFoundException('User not found');
      return new HttpException('Unit not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
