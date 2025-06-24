// create-gossip.dto.ts
import { IsString, IsNotEmpty, isNumber } from 'class-validator';

export class CreateGossipDto {
  @IsString()
  @IsNotEmpty()
  content: string;


}
