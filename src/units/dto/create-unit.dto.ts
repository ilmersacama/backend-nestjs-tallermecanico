import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUnitDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  unit: string;

  @IsString()
  description: string;
}
