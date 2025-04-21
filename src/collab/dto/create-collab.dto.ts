// create-collab.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateCollabRoleDto {
  @IsString()
  @IsNotEmpty()
  roleName: string;
}

export class CreateCollabDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateCollabRoleDto)
  roles: CreateCollabRoleDto[];
}
