import { Controller, Post, Body } from '@nestjs/common';
import { MessagingService } from '../messaging/messaging.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post()
  async sendMessage(@Body() body: { message }) {
    await this.messagingService.add({
      name: 'message',
      data: body.message || 'Hello world!',
    });

    return 'OK';
  }
}
