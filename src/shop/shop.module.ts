import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule
@Module({
  imports: [PrismaModule],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
