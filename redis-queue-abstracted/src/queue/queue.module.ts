import { BullModule } from '@nestjs/bull';
import { Module, OnModuleInit } from '@nestjs/common';
import { REDIS_HOST, REDIS_PORT, QUEUE_NAME } from '../common/constants';
import { QueueConsumer } from './queue.consumer';
import { QueueService } from './queue.service';
import { BullQueueService } from './bull/bull.queue.service';

@Module({})
export class QueueModule implements OnModuleInit {
  constructor(private readonly queueConsumer: QueueConsumer) {}
  onModuleInit() {
    console.log('QueueModule has been initialized.');

    // register handlers if was initialized as consumer
    this.queueConsumer.registerHandler({
      messageName: 'message',
      handler: (message) => {
        console.log('message', message);
      },
    });
  }

  // add async startup
  // add options
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
      providers: [
        // only add to providers if module is registered as producer
        {
          provide: QueueService,
          useClass: BullQueueService,
        },
      ],
      exports: [BullModule],
    };
  }
}
