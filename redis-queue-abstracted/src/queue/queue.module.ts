import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { REDIS_HOST, REDIS_PORT, QUEUE_NAME } from '../common/constants';

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
  controllers: [],
})
export class QueueModule {}
