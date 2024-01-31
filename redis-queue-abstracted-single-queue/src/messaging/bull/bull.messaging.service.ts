import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { MessagingService } from '../messaging.service';
import { Message } from '../types';

@Injectable()
export class BullMessagingService extends MessagingService {
  constructor(private readonly queue: Queue) {
    super();
  }
  async add<T>(message: Message<T>) {
    console.log('Adding message to queue', message);
    await this.queue.add(message.name, message.data);
  }
}
