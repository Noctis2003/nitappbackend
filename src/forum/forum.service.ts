// this is very easy

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { likePostDto } from './dto/like-post.dto';
@Injectable()
export class ForumService {
  constructor(private readonly prisma: PrismaService) {}





  async getCommentsByPostId(postId: number) {
    console.log('Fetching comments for postId:', postId);
    const comments = await this.prisma.forumComment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    return {
      status: 200,
      message: 'Comments fetched successfully',
      data: comments,
    };
  }
   async likedPost(userId: number, postId: number) {
    const like = await this.prisma.forumLike.findFirst({
      where: {
        userId,
        postId,
      },
    });
    return like ? true : false;
  }



  async deletePost(id: Number, userId: number) {
    const post = await this.prisma.forumPost.findUnique({
      where: { id: Number(id),
        userId: userId  
       },
    
    });

    if (!post) {
      return {
        status: 404,
        message: 'Post not found',
      };
    }

    


    // Delete all comments associated with the post
    await this.prisma.forumComment.deleteMany({
      where: { postId: Number(id) },
    });

    // Delete all likes associated with the post
    await this.prisma.forumLike.deleteMany({
      where: { postId: Number(id) },
    });

    // Finally, delete the post itself
    await this.prisma.forumPost.delete({
      where: { id: Number(id) },
    });

    return {
      status: 200,
      message: 'Post deleted successfully',
    };
  }

  async likePost(likePostDto: likePostDto , userId: number) {

const { postId } = likePostDto;
    const existingLike = await this.prisma.forumLike.findFirst({
      where: {
        userId,
        postId,
      },
    });


    if (existingLike) {
      await this.prisma.forumLike.delete({
        where: {
          id: existingLike.id,
        },
      });
      return {
        status: 200,
        message: 'Post unliked successfully',
      };
    }

    const like = await this.prisma.forumLike.create({
      data: {
        postId,
        userId,
      },
    });


    return {
      status: 200,
      message: 'Post liked successfully',
      data: like,
    };
  }



  async createComment(createCommentDto: CreateCommentDto ,userId: number) {
    const { postId, content } = createCommentDto;
    return this.prisma.forumComment.create({
      data: {
        content,
        postId,
        userId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  }

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


  async getPostById(id: string) {
    const post = await this.prisma.forumPost.findUnique({
      where: { id: Number(id) },
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

    if (!post) {
      return {
        status: 404,
        message: 'Post not found',
      };
    }

    return {
      status: 200,
      message: 'Post fetched successfully',
      data: post,
    };
  }

}