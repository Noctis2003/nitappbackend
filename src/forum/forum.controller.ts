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

@UseGuards(JwtAuthGuard) // Protect all routes with JWT
@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post('create')
  async createPost(
    @Body() body: { title: string; description: string },
    @Request() req: { user: { userId: number } },
  ) {
    try {
      const { title, description } = body;
      const userId = req.user.userId; // Extract user ID from JWT payload
      return await this.forumService.createPost(title, description, userId);
    } catch (error) {
      console.error('Error creating post:', error.message);
      throw new HttpException(
        'Error creating post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('all')
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
