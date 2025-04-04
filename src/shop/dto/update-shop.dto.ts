import { PartialType } from '@nestjs/mapped-types';
import { CreateShopDto } from './create-shop.dto';

export class UpdateShopDto extends PartialType(CreateShopDto) {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
}
