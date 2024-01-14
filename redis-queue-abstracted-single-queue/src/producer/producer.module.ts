import { Module } from '@nestjs/common';
import { MessageController } from './producer.controller';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [
    MessagingModule.forRoot({
      type: ['producer'],
      connectionUrl: 'redis://redis:6379',
    }),
  ],
  controllers: [MessageController],
})
export class ProducerModule {}
