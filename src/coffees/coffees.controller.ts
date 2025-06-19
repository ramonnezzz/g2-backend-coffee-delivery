import { Controller, Get, Post, Body, Param, HttpStatus, HttpCode, Query, Patch, Delete, NotFoundException } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  async findAll() {
    return this.coffeesService.findAll();
  }

  @Get('search')
  async search(
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('name') name?: string,
    @Query('tags') tags?: string,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    const tagsList = tags ? tags.split(',') : [];
    
    return this.coffeesService.searchCoffees({
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
      name,
      tags: tagsList,
      limit: +limit,
      offset: +offset,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const coffee = await this.coffeesService.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`Coffee with ID ${id} not found`);
    }
    return coffee;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    const updatedCoffee = await this.coffeesService.update(id, updateCoffeeDto);
    if (!updatedCoffee) {
      throw new NotFoundException(`Coffee with ID ${id} not found`);
    }
    return updatedCoffee;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const coffee = await this.coffeesService.remove(id);
    if (!coffee) {
      throw new NotFoundException(`Coffee with ID ${id} not found`);
    }
    return { message: 'Coffee deleted successfully' };
  }
}
