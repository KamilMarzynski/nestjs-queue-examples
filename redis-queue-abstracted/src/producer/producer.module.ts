import { Module } from '@nestjs/common';
import { MessageController } from './producer.controller';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule.forRoot()],
  controllers: [MessageController],
})
export class ProducerModule {}
