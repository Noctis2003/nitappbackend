import { Controller, Post, Body, Get } from '@nestjs/common';
import { GossipService } from './gossip.service';
import { CreateGossipDto } from './dto/create-gossip.dto';

@Controller('gossip')
export class GossipController {
  constructor(private readonly gossipService: GossipService) {}

  @Post('create')
  create(@Body() createGossipDto: CreateGossipDto) {
    return this.gossipService.create(createGossipDto);
  }
  @Get('get')
  getGossip() {
    return this.gossipService.getGossip();
  }
}
