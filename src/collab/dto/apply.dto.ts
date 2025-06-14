import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ApplyDto {
  @IsNotEmpty()
  @IsNumber()
  roleId: number;



  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  message: string;
}
