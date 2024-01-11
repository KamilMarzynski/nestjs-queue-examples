import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QUEUE_NAME } from '../../common/constants';
import { QueueService } from '../queue.service';
import { Message } from '../types';

export class BullQueueService extends QueueService {
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
