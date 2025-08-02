import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'I see you are trying my API, Well atleast go through the docs first';
  }
}
