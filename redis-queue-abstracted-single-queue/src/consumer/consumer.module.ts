import { Module } from '@nestjs/common';
import { MessagingModule } from '../messaging/messaging.module';
import { TestMessageHandler } from './test.message.handler';
import { TestMessageHandlerV2 } from './test.message.handlerV2';

@Module({
  imports: [
    MessagingModule.forRoot({
      mode: ['consumer'],
      connectionUrl: 'redis://redis:6379',
      queueName: 'test-queue',
    }),
  ],
  providers: [TestMessageHandler, TestMessageHandlerV2],
})
export class ConsumerModule {}
