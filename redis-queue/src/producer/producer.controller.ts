import { InjectQueue } from '@nestjs/bull';
import { Controller, Get } from '@nestjs/common';
import { Queue } from 'bull';
import { JOB_NAME, QUEUE_NAME } from '../common/constants';

@Controller('message')
export class MessageController {
  constructor(@InjectQueue(QUEUE_NAME) private readonly messageQueue: Queue) {}

  @Get()
  async sendMessage() {
    await this.messageQueue.add(JOB_NAME, {
      message: 'test message',
    });

    return 'OK';
  }
}
