import { Controller, Post, Body } from '@nestjs/common';
import { MessagingService } from '../messaging/messaging.service';
import { TestMessage } from 'src/common/test.message';

@Controller('message')
export class MessageController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post()
  async sendMessage(@Body() body: { message }) {
    await this.messagingService.add(new TestMessage({ test: body.message }));

    return 'OK';
  }
}
