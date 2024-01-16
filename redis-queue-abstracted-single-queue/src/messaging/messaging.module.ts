import { BullModule } from '@nestjs/bull';
import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { QUEUE_NAME } from '../common/constants';
import { BullMessageConsumer } from './bull/bull.queue.consumer';
import { BullMessagingService } from './bull/bull.messaging.service';
import { MessageConsumer } from './message.consumer';
import { MessagingService } from './messaging.service';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';

export type MessagingModuleOptions = {
  mode: ('producer' | 'consumer')[];
  connectionUrl: `redis://${string}:${string}`;
};

@Module({})
export class MessagingModule implements OnModuleInit {
  constructor(@Inject('QUEUE_MODE') private readonly queueMode: string[]) {}

  onModuleInit() {
    console.log('QueueModule has been initialized.');
    console.log(this.queueMode);

    // if (this.queueMode.includes('consumer')) {
    //   consumerInstance.registerHandler({
    //     messageName: 'message',
    //     handler: (message) => {
    //       console.log('message', message);
    //     },
    //   });
    // }
  }

  // add async startup
  static forRoot(options: MessagingModuleOptions) {
    const url = options.connectionUrl.split('redis://')[1];
    const host = url.split(':')[0];
    const port = url.split(':')[1];

    const providers = [];
    const exports = [];

    if (options.mode.includes('producer')) {
      providers.push({
        provide: MessagingService,
        useClass: BullMessagingService,
      });

      exports.push(MessagingService);
    }

    if (options.mode.includes('consumer')) {
      providers.push({
        provide: MessageConsumer,
        useClass: BullMessageConsumer,
      });
      providers.push({
        provide: 'INTERNAL_TOKEN_QUEUE_CONSUMER',
        useValue: BullMessageConsumer,
      });

      exports.push(MessageConsumer);
    }

    providers.push({
      provide: 'QUEUE_MODE',
      useValue: options.mode,
    });

    return {
      module: MessagingModule,
      imports: [
        DiscoveryModule,
        BullModule.forRoot({
          redis: {
            host,
            port: parseInt(port, 10),
          },
        }),
        BullModule.registerQueue({
          name: QUEUE_NAME,
        }),
      ],
      providers: [...providers],
      exports: [...exports],
    };
  }
}
