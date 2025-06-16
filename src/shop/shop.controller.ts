import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
  Request,
  Delete,
  Query,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard) // Protect all routes with JWT
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('create')
  async createProduct(
    @Body()
    body: {
      name: string;
      price: number | string;
      description: string;
      image?: string;
    },
    @Request() req: { user: { userId: number } },
  ) {
    try {
      const { name, price, description, image } = body;
      const userId = req.user.userId; // Extract user ID from JWT payload
      return await this.shopService.createProduct(
        name,
        price,
        description,
        image,
        userId,
      );
    } catch (error) {
      console.error('Error creating product:', error.message);
      throw new HttpException(
        'Error creating product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


@Delete('delete')
  async deleteProduct(
    @Query('id') id: string,
    @Request() req: { user: { userId: number } },
  ) {
    try {
      const userId = req.user.userId; // Extract user ID from JWT payload
      return await this.shopService.deleteProduct(+id,userId);
    } catch (error) {
      console.error('Error deleting product:', error.message);
      throw new HttpException(
        'Error deleting product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @UseGuards(JwtAuthGuard) 
  @Get('all')
  async getProducts( @Request() req: { user: { email: string } }) {
    try {
        const email = req.user.email; 
      return await this.shopService.getproducts(email);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      throw new HttpException(
        'Error fetching products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
