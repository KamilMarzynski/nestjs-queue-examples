import { InjectQueue } from '@nestjs/bull';
import { Controller, Post, Body } from '@nestjs/common';
import { Queue } from 'bull';
import { JOB_NAME, QUEUE_NAME } from '../common/constants';

@Controller('message')
export class MessageController {
  constructor(@InjectQueue(QUEUE_NAME) private readonly messageQueue: Queue) {}

  @Post()
  async sendMessage(@Body() body: { message }) {
    await this.messageQueue.add(JOB_NAME, {
      message: body.message || 'Hello world!',
    });

    return 'OK';
  }
}
