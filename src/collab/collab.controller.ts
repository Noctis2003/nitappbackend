import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Query,
  Get,
  Delete,
} from '@nestjs/common';
import { CollabService } from './collab.service';
import { CreateCollabDto } from './dto/create-collab.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { use } from 'passport';
import { ApplyDto } from './dto/apply.dto';
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
  @Post('apply')
  async applyCollab(@Body() apply: ApplyDto, @Req() req: Request) {

    const userId = (req.user as { userId: number }).userId;

    return this.collabService.applyCollab(apply , userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('collabs')
  async getCollab(@Query('id') id: string) {
    return this.collabService.getCollabById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Delete('collab')
  async deleteCollab(@Query('id') id: string) {
    return this.collabService.deleteGig(Number(id));
  }


  @UseGuards(JwtAuthGuard)
  @Delete ('delete')
  async deleteApplication(
    @Query('id') id: string,
  ) {
  
    return this.collabService.deleteapplication(Number(id));
  }


  @UseGuards(JwtAuthGuard)
  @Get('get')
  async getCollabs(
    @Query('scope') scope: 'local' | 'global' = 'global',
    @Req() req: Request,
  ) {
    const email = (req.user as { email: string }).email;
    return this.collabService.getCollabs(scope, email);
  }

  

}
