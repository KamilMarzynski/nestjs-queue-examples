import { Module } from '@nestjs/common';
import { MessageController } from './producer.controller';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
  imports: [MessagingModule.forRoot()],
  controllers: [MessageController],
})
export class ProducerModule {}
