import { Injectable } from '@nestjs/common';
import { CreateCollabDto } from './dto/create-collab.dto';
import { UpdateCollabDto } from './dto/update-collab.dto';

@Injectable()
export class CollabService {
  create(createCollabDto: CreateCollabDto) {
    return 'This action adds a new collab';
  }

  findAll() {
    return `This action returns all collab`;
  }

  findOne(id: number) {
    return `This action returns a #${id} collab`;
  }

  update(id: number, updateCollabDto: UpdateCollabDto) {
    return `This action updates a #${id} collab`;
  }

  remove(id: number) {
    return `This action removes a #${id} collab`;
  }
}
