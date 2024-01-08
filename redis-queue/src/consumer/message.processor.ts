import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { JOB_NAME, QUEUE_NAME } from '../common/constants';

@Processor(QUEUE_NAME)
export class MessageProcessor {
  private readonly logger = new Logger(MessageProcessor.name);

  @Process(JOB_NAME)
  handleMessage(job: Job) {
    console.log(job.data);
    this.logger.log('received message: ' + job.data.message);
  }
}
