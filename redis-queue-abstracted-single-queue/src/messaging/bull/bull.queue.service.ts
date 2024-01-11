import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { QUEUE_NAME } from '../../common/constants';
import { MessagingService } from '../messaging.service';
import { Message } from '../types';

@Injectable()
export class BullMessagingService extends MessagingService {
  //   private queue1;
  constructor(@InjectQueue(QUEUE_NAME) private readonly queue: Queue) {
    super();
    // this might be used to create multiple queues based on some config
    // this.queue1 = new Bull(QUEUE_NAME);
  }
  async add<T>(message: Message<T>) {
    await this.queue.add({
      name: message.name,
      data: message.data,
    });
  }
}
