import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MessageProcessor } from './message.processor';

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
  providers: [MessageProcessor],
})
export class ConsumerModule {}
