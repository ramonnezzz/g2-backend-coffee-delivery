import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const coffees = await this.prisma.coffee.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return coffees.map(coffee => ({
      ...coffee,
      tags: coffee.tags.map(coffeeTag => coffeeTag.tag),
    }));
  }

  async findOne(id: string) {
    const coffee = await this.prisma.coffee.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee with ID ${id} not found`);
    }

    return {
      ...coffee,
      tags: coffee.tags.map(coffeeTag => coffeeTag.tag),
    };
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const { tags = [], ...coffeeData } = createCoffeeDto;

    const coffee = await this.prisma.coffee.create({ data: coffeeData });
  
    for (const tagName of tags) {
      let tag = await this.prisma.tag.findUnique({ where: { name: tagName } });
  
      if (!tag) {
        tag = await this.prisma.tag.create({ data: { name: tagName } });
      }
  
      await this.prisma.coffeeTag.create({
        data: { coffeeId: coffee.id, tagId: tag.id },
      });
    }
  
    return this.prisma.coffee.findUnique({
      where: { id: coffee.id },
      include: { tags: { include: { tag: true } } },
    });
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const { tags, ...coffeeData } = updateCoffeeDto;
  
    const coffee = await this.prisma.coffee.update({
      where: { id },
      data: coffeeData,
    });
  
    if (tags) {
      await this.prisma.coffeeTag.deleteMany({ where: { coffeeId: id } });
  
      for (const tagName of tags) {
        let tag = await this.prisma.tag.findUnique({ where: { name: tagName } });
  
        if (!tag) {
          tag = await this.prisma.tag.create({ data: { name: tagName } });
        }
  
        await this.prisma.coffeeTag.create({
          data: { coffeeId: id, tagId: tag.id },
        });
      }
    }
  
    return this.prisma.coffee.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });
  }

  async remove(id: string) {
    const coffee = await this.prisma.coffee.findUnique({ where: { id } });
  
    if (!coffee) {
      throw new NotFoundException(`Café com ID ${id} não encontrado`);
    }
  
    await this.prisma.coffee.delete({ where: { id } });
  }

  async searchCoffees(params: {
    start_date?: Date;
    end_date?: Date;
    name?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }) {
    const { start_date, end_date, name, tags, limit = 10, offset = 0 } = params;

    // Construir o filtro

    // Filtro por data

    // Filtro por nome

    // Filtro por tags

    // Buscar os cafés com paginação

    // Formatar a resposta
    return {
      data: [],
      pagination: {
        total: [],
        limit,
        offset,
        hasMore: offset,
      },
    };
  }
} 