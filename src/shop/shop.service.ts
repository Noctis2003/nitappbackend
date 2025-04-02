import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Shop } from '@prisma/client';
import { CreateShopDto } from './dto/create-shop.dto';

@Injectable()
export class ShopService {
  constructor(private prisma: PrismaService) {}

  async create(createShopDto: CreateShopDto): Promise<Shop> {
    try {
      return await this.prisma.shop.create({
        data: {
          ...createShopDto,
        },
      });
    } catch (error: any) {
      if (error instanceof Error) {
        throw new Error(`Failed to create shop: ${error.message}`);
      } else {
        throw new Error('Failed to create shop: unknown error occurred');
      }
    }
  }
}
