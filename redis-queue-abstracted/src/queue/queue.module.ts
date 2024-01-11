import { BullModule } from '@nestjs/bull';
import { Module, OnModuleInit } from '@nestjs/common';
import { REDIS_HOST, REDIS_PORT, QUEUE_NAME } from '../common/constants';
import { QueueConsumer } from './queue.consumer';

@Module({})
export class QueueModule implements OnModuleInit {
  constructor(private readonly queueConsumer: QueueConsumer) {}
  onModuleInit() {
    console.log('QueueModule has been initialized.');

    // register handlers if was initialized as consumer
    this.queueConsumer.registerHandler({
      queueName: QUEUE_NAME,
      messageName: 'message',
      handler: (message) => {
        console.log('message', message);
      },
    });
  }

  // add async startup
  static forRoot() {
    // TODO: dynamically register queue names
    // queues might be registered with processors if queue module is registered as consumer
    // add some way of providing queue services dynamically
    // when started with queue names as producer, should provide queue services
    // maybe create some decorator to inject right function, that is provided by generated token using queue name
    // then this function should have queue injected here

    // do this only if module is registered as consumer
    const queueConsumer = new QueueConsumer();

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
          // do this only if module is registered as consumer
          processors: [
            {
              callback: (job) => {
                queueConsumer.processMessageOnHandlers(
                  job.queue.name,
                  job.data,
                );
              },
            },
          ],
        }),
      ],
      providers: [
        {
          provide: QueueConsumer,
          useValue: queueConsumer,
        },
      ],
      exports: [BullModule],
    };
  }
}
