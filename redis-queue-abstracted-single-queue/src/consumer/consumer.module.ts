import { Module } from '@nestjs/common';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [
    MessagingModule.forRoot({
      mode: ['consumer'],
      connectionUrl: 'redis://redis:6379',
    }),
  ],
  providers: [],
})
export class ConsumerModule {}
