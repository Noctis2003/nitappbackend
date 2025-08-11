// src/forum/dto/create-post.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class likePostDto {
  

  @IsNotEmpty()
  postId: number;
}
