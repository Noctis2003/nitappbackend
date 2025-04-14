import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ForumService {
  constructor(private readonly prisma: PrismaService) {}
  async createPost(title: string, description: string, userId: number) {
    return this.prisma.forumPost.create({
      data: {
        title,
        description,
        userId,
      },
    });
  }
  async getPosts() {
    return this.prisma.forumPost.findMany({
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });
  }
}
