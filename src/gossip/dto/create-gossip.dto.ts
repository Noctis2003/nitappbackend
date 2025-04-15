// create-gossip.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGossipDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
