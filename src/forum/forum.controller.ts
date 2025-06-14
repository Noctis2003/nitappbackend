import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ForumService } from './forum.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { likePostDto } from './dto/like-post.dto';
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

  @Post('like')
  async likePost(
    @Body() likePostDto: likePostDto
  ) {
    try {
      return await this.forumService.likePost(likePostDto);
    } catch (error) {
      console.error('Error liking post:', error.message);
      throw new HttpException(
        'Error liking post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('comments')
  async getCommentsByPostId(@Query('postId') postId: number) {
    try {
      return await this.forumService.getCommentsByPostId(postId);
    } catch (error) {
      console.error('Error fetching comments:', error.message);
      throw new HttpException(
        'Error fetching comments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('comment')
  async createComment(
    @Body() createCommentDto: CreateCommentDto,

  ) {
    try {
      return await this.forumService.createComment(createCommentDto);
    } catch (error) {
      console.error('Error creating comment:', error.message);
      throw new HttpException(
        'Error creating comment',
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

    @Get('getsingle')
  async getPostById(@Query('id') id: string) {
    try {
      const post = await this.forumService.getPostById(id);
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      return post;
    } catch (error) {
      console.error('Error fetching post:', error.message);
      throw new HttpException(
        'Error fetching post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
