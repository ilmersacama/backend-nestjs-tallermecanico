import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @Type(() => Number)
  @IsInt()
  unitId: number;

  @IsNotEmpty()
  @IsString()
  barcode: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  name: string;

  @IsString()
  description: string;

  image: any;
}
