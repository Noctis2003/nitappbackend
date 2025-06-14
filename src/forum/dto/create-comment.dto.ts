import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
    @IsNotEmpty()
    postId: number;

    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    content: string;
}