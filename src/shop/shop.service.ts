/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, MarketplaceProduct } from '@prisma/client';
import { AuthService } from '../auth/auth.service'; // Adjust the import path as necessary
@Injectable()
export class ShopService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService, 
  ) {}
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


  



  async deleteProduct(id: number,userId): Promise<MarketplaceProduct> {
    try {
      const product = await this.prisma.marketplaceProduct.findUnique({
        where: { id 
          , userId: userId  // Ensure the product belongs to the user
        }
        ,
      });

      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      const deletedProduct = await this.prisma.marketplaceProduct.delete({
        where: { id },
      });

      return deletedProduct;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error deleting product:', error);
      throw new HttpException(
        'Error deleting product',
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

  async getproducts( email: string) {
    
      const domain = this.authService.getUserEmailDomain(email); // ← Use your auth method here


    return this.prisma.marketplaceProduct.findMany({
      where: {
        user: {
          email: {
            endsWith: `@${domain}`,
          },
        },
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });
    

}
}