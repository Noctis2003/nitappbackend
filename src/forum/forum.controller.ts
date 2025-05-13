import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ForumService } from './forum.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
@UseGuards(JwtAuthGuard) // Protect all routes with JWT
@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post('create')
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req: { user: { userId: number } },
  ) {
    try {
      const userId = req.user.userId; // Extract user ID from JWT payload
      return await this.forumService.createPost(createPostDto, userId);
    } catch (error) {
      console.error('Error creating post:', error.message);
      throw new HttpException(
        'Error creating post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('get')
  async getPosts() {
    try {
      return await this.forumService.getPosts();
    } catch (error) {
      console.error('Error fetching posts:', error.message);
      throw new HttpException(
        'Error fetching posts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
