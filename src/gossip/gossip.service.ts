import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateGossipDto } from './dto/create-gossip.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GossipService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGossipDto: CreateGossipDto , userId: number) {
    const content = createGossipDto.content;
   const res = await this.prisma.gossip.create({
      data: {
        content,
        user:{
          connect: { id: userId },
        }
      },
    });
    return {
      status: HttpStatus.OK,
      message: 'Gossip created successfully',
      data: res,
    };
  }

  async getGossip(email: string) {
    const domain = email.split('@')[1];
    console.log('Domain:', domain);
    const gossip = await this.prisma.gossip.findMany({
      where: {
        user: {
          email: {
            endsWith: domain,
          },
        },
      },

    });

    if (!gossip || gossip.length === 0) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'No gossip found for this domain',
        data: null,
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'Gossip retrieved successfully',
      data: gossip,
      
    };
  }
}
