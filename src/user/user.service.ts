import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    
    return this.prisma.user.create({
      data: {
        ...createUserDto,
       
      },
    });
  }

  async findbyusername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        collabApplications: {
          include: {
            role: true,
          },
        },
        collabGigs: {
          include: {
            roles: true,
          },
        },
        forumPosts: {
          include: {
            comments: true,
            likes: true,
          },
        }
        ,
        marketplaceProducts: true,
        
      },
    });
  }
}
