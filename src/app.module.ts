import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ForumModule } from './forum/forum.module';
import { DoubtsModule } from './doubts/doubts.module';
import { ShopModule } from './shop/shop.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GossipModule } from './gossip/gossip.module';
import { CollabModule } from './collab/collab.module';

@Module({
  imports: [
    PrismaModule,
    ForumModule,
    DoubtsModule,
    ShopModule,
    UserModule,
    AuthModule,
    GossipModule,
    CollabModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
