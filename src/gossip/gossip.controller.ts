import { Controller, Post, Body, Get , UseGuards , Req} from '@nestjs/common';
import { GossipService } from './gossip.service';
import { CreateGossipDto } from './dto/create-gossip.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
@Controller('gossip')
export class GossipController {
  constructor(private readonly gossipService: GossipService) {}

 @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() createGossipDto: CreateGossipDto , @Req() req: Request) {
    const userId = (req.user as { userId: number }).userId;
    return this.gossipService.create(createGossipDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get')
  getGossip(  @Req() req: Request, ) {
    const email = (req.user as { email: string }).email;
    return this.gossipService.getGossip(email);
    
  }
}
