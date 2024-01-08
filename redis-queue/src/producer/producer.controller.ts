import { InjectQueue } from '@nestjs/bull';
import { Controller, Get } from '@nestjs/common';
import { Queue } from 'bull';

@Controller('message')
export class MessageController {
  constructor(
    @InjectQueue('message_queue') private readonly messageQueue: Queue,
  ) {}

  @Get()
  async sendMessage() {
    await this.messageQueue.add('message', {
      message: 'test message',
    });

    return 'OK';
  }
}
