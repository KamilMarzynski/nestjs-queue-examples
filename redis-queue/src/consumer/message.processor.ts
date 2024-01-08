import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('message_queue')
export class MessageProcessor {
  private readonly logger = new Logger(MessageProcessor.name);

  @Process('message')
  handleMessage(job: Job) {
    console.log(job.data);
    this.logger.log('received message: ' + job.data.message);
  }
}
