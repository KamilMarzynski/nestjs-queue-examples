import { Processor, Process } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE_NAME } from '../../common/constants';
import { MessageConsumer } from '../message.consumer';

@Injectable()
@Processor(QUEUE_NAME)
export class BullMessageConsumer extends MessageConsumer {
  @Process()
  async handleMessage(job: Job) {
    console.log('Received message' + job.data);
    await this.processMessageOnHandlers(job.data);
  }
}
