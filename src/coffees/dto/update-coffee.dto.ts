import { PartialType } from '@nestjs/mapped-types';
import { CreateCoffeeDto } from './create-coffee.dto';
import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {
  tagIds?: string[];
  // adicione outros campos
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsArray()
  tags: string[];
} 