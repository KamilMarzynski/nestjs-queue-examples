import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { REDIS_HOST, REDIS_PORT, QUEUE_NAME } from '../common/constants';

@Module({})
export class QueueModule {
  static forRoot() {
    // TODO: dynamically register queue names
    // queues might be registered with processors if queue module is registered as consumer
    // add some way of providing queue services dynamically
    // when started with queue names as producer, should provide queue services
    // maybe create some decorator to inject right function, that is provided by generated token using queue name
    // then this function should have queue injected here

    return {
      module: QueueModule,
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
      exports: [BullModule],
    };
  }
}
