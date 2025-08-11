import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGigDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
