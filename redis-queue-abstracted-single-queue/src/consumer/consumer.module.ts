import { Module } from '@nestjs/common';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [
    MessagingModule.forRoot({
      type: ['consumer'],
      connectionUrl: 'redis://redis:6379',
    }),
  ],
  providers: [],
})
export class ConsumerModule {}
