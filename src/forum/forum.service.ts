import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class ForumService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(createPostDto: CreatePostDto, userId: number) {
    const { title, description } = createPostDto;

    return this.prisma.forumPost.create({
      data: {
        title,
        description,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        likes: true,
        comments: true,
      },
    });
  }

  async getPosts() {
    const res = await this.prisma.forumPost.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        likes: true,
        comments: true,
      },
    });
    return {
      status: 200,
      message: 'Posts fetched successfully',
      data: res,
    };
  }
}
