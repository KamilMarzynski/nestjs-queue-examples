import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MessageController } from './producer.controller';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'message_queue',
    }),
  ],
  controllers: [MessageController],
})
export class ProducerModule {}
