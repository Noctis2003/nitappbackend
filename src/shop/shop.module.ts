import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule], 
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
