import { Injectable } from '@nestjs/common';
import { CreateDoubtDto } from './dto/create-doubt.dto';
import { UpdateDoubtDto } from './dto/update-doubt.dto';

@Injectable()
export class DoubtsService {
  create(createDoubtDto: CreateDoubtDto) {
    return 'This action adds a new doubt';
  }

  findAll() {
    return `This action returns all doubts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doubt`;
  }

  update(id: number, updateDoubtDto: UpdateDoubtDto) {
    return `This action updates a #${id} doubt`;
  }

  remove(id: number) {
    return `This action removes a #${id} doubt`;
  }
}
