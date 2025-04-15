import { Module } from '@nestjs/common';
import { CollabService } from './collab.service';
import { CollabController } from './collab.controller';

@Module({
  controllers: [CollabController],
  providers: [CollabService],
})
export class CollabModule {}
