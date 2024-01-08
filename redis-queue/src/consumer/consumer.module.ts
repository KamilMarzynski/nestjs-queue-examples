import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MessageProcessor } from './message.processor';
import { QUEUE_NAME, REDIS_HOST, REDIS_PORT } from '../common/constants';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: REDIS_HOST,
        port: REDIS_PORT,
      },
    }),
    BullModule.registerQueue({
      name: QUEUE_NAME,
    }),
  ],
  providers: [MessageProcessor],
})
export class ConsumerModule {}
