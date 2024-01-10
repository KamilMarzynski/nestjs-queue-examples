import { Module } from '@nestjs/common';
import { MessageController } from './producer.controller';

@Module({
  imports: [],
  controllers: [MessageController],
})
export class ProducerModule {}
