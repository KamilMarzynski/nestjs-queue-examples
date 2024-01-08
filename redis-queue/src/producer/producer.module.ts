import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MessageController } from './producer.controller';
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
  controllers: [MessageController],
})
export class ProducerModule {}
