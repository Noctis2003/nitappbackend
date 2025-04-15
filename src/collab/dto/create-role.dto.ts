import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsNumber()
  gigId: number;

  @IsNotEmpty()
  @IsString()
  roleName: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
