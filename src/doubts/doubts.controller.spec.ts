import { Test, TestingModule } from '@nestjs/testing';
import { DoubtsController } from './doubts.controller';
import { DoubtsService } from './doubts.service';

describe('DoubtsController', () => {
  let controller: DoubtsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoubtsController],
      providers: [DoubtsService],
    }).compile();

    controller = module.get<DoubtsController>(DoubtsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
