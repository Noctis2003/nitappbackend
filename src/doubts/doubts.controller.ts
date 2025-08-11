import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DoubtsService } from './doubts.service';
import { CreateDoubtDto } from './dto/create-doubt.dto';
import { UpdateDoubtDto } from './dto/update-doubt.dto';

@Controller('doubts')
export class DoubtsController {
  constructor(private readonly doubtsService: DoubtsService) {}

  @Post()
  create(@Body() createDoubtDto: CreateDoubtDto) {
    return this.doubtsService.create(createDoubtDto);
  }

  @Get()
  findAll() {
    return this.doubtsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doubtsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoubtDto: UpdateDoubtDto) {
    return this.doubtsService.update(+id, updateDoubtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doubtsService.remove(+id);
  }
}
