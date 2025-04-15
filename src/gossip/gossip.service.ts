import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateGossipDto } from './dto/create-gossip.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GossipService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGossipDto: CreateGossipDto) {
    const res = await this.prisma.gossip.create({
      data: {
        content: createGossipDto.content,
      },
    });
    return {
      status: HttpStatus.OK,
      message: 'Gossip created successfully',
      data: res,
    };
  }
}
