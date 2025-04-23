import { Injectable } from '@nestjs/common';
import { CreateCollabDto } from './dto/create-collab.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpStatus, HttpException } from '@nestjs/common';

@Injectable()
export class CollabService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCollabDto: CreateCollabDto, userId: number) {
    if (!userId) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'User not found',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const res = await this.prisma.collabGig.create({
      data: {
        name: createCollabDto.name,
        description: createCollabDto.description,
        userId: userId,
        roles: {
          create: createCollabDto.roles.map((role) => ({
            roleName: role.roleName,
          })),
        },
      },
      include: {
        roles: true,
      },
    });
    return {
      status: HttpStatus.OK,
      message: 'Collab created successfully',
      data: res,
    };
  }
}
// this is how you do it in nestjs
// this is the way you do it in nestjs
