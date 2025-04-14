/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, MarketplaceProduct } from '@prisma/client';

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(
    name: string,
    price: number | string,
    description: string,
    image: string | undefined,
    userId: number,
  ): Promise<MarketplaceProduct> {
    try {
      const priceValue = typeof price === 'string' ? parseFloat(price) : price;

      if (isNaN(priceValue) || priceValue <= 0) {
        throw new HttpException('Invalid price value', HttpStatus.BAD_REQUEST);
      }

      const decimalPrice = new Prisma.Decimal(priceValue.toString());

      const product = await this.prisma.marketplaceProduct.create({
        data: {
          name,
          description,
          price: decimalPrice,
          image: image ?? null,
          userId,
        },
      });

      return product;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error creating product:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error creating product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProducts(): Promise<MarketplaceProduct[]> {
    try {
      const products = await this.prisma.marketplaceProduct.findMany({
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new HttpException(
        'Error fetching products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
