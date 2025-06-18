import { Type } from 'class-transformer';
import { IsString, Length, IsNumber, Min, Max, IsUrl, IsArray, ArrayNotEmpty, IsPositive, Matches } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsString()
  @Length(10, 200)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O preço deve ter no máximo 2 casas decimais' })
  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsUrl()
  imageUrl: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];
}