import { Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE_NAME } from '../../common/constants';
import { QueueConsumer } from '../queue.consumer';

@Injectable()
@Processor(QUEUE_NAME)
export class BullQueueConsumer extends QueueConsumer {
  async handleMessage(job: Job) {
    await this.processMessageOnHandlers(job.data);
  }
}
