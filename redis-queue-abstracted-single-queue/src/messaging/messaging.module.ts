import { BullModule } from '@nestjs/bull';
import { Module, OnModuleInit } from '@nestjs/common';
import { REDIS_HOST, REDIS_PORT, QUEUE_NAME } from '../common/constants';
import { MessageConsumer } from './message.consumer';
import { MessagingService } from './messaging.service';
import { BullMessagingService } from './bull/bull.queue.service';

export type MessagingModuleOptions = {
  type: ('producer' | 'consumer')[];
  connectionUrl: `redis://${string}:${string}`;
};

@Module({})
export class MessagingModule implements OnModuleInit {
  constructor(private readonly messageConsumer: MessageConsumer) {}
  onModuleInit() {
    console.log('QueueModule has been initialized.');

    // register handlers if was initialized as consumer
    this.messageConsumer.registerHandler({
      messageName: 'message',
      handler: (message) => {
        console.log('message', message);
      },
    });
  }

  // add async startup
  // add options
  static forRoot(options: MessagingModuleOptions) {
    // TODO: dynamically register queue names
    // queues might be registered with processors if queue module is registered as consumer
    // add some way of providing queue services dynamically
    // when started with queue names as producer, should provide queue services
    // maybe create some decorator to inject right function, that is provided by generated token using queue name
    // then this function should have queue injected here

    return {
      module: MessagingModule,
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
          provide: MessagingService,
          useClass: BullMessagingService,
        },
      ],
      exports: [MessagingService],
    };
  }
}
