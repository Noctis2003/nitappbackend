import { Module } from '@nestjs/common';
import { GossipService } from './gossip.service';
import { GossipController } from './gossip.controller';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  controllers: [GossipController],
  providers: [GossipService],
})
export class GossipModule {}
