import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Query,
  Get,
} from '@nestjs/common';
import { CollabService } from './collab.service';
import { CreateCollabDto } from './dto/create-collab.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('collab')
export class CollabController {
  constructor(private readonly collabService: CollabService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() createCollabDto: CreateCollabDto, @Req() req: Request) {
    const userId = (req.user as { userId: number }).userId;
    return this.collabService.create(createCollabDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('collabs')
  async getCollabs(
    @Query('scope') scope: 'local' | 'global' = 'global',
    @Req() req: Request,
  ) {
    const email = (req.user as { email: string }).email;
    return this.collabService.getCollabs(scope, email);
  }
  // You can add other endpoints here (e.g. findAll, findOne, etc.)
}
