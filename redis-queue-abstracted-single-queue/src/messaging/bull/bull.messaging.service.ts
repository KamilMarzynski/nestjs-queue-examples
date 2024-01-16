import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUE_NAME } from '../../common/constants';
import { MessagingService } from '../messaging.service';
import { Message } from '../types';

@Injectable()
export class BullMessagingService extends MessagingService {
  constructor(@InjectQueue(QUEUE_NAME) private readonly queue: Queue) {
    super();
  }
  async add<T>(message: Message<T>) {
    console.log('Adding message to queue', message);
    await this.queue.add({
      name: message.name,
      data: message.data,
    });
  }
}
