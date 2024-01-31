import { Module, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import { BullMessageConsumer } from './bull/bull.queue.consumer';
import { MessageConsumer } from './message.consumer';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { MESSAGE_LISTENER_METADATA } from './messaging.listener.decorator';
import { MessageHandler } from './message.handler';
import { QUEUE_NAME } from 'src/common/constants';

export type MessagingModuleOptions = {
  mode: ('producer' | 'consumer')[];
  connectionUrl: `redis://${string}:${string}`;
};

@Module({})
export class MessagingConsumerModule implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly messageConsumer: MessageConsumer,
  ) {}

  // TODO: based on QUEUE_OPTIONS instantiate here proper worker if needed, e.g. bull worker
  // then register all message listeners
  // and next start listening for messages
  onModuleInit() {
    const worker = new Worker(
      QUEUE_NAME,
      async (job) => {
        console.log('Received message', job.data);
        await this.messageConsumer.processMessageOnHandlers(job.data);
      },
      {
        autorun: false,
        connection: {
          host: 'localhost',
          port: 6379,
        },
      },
    );
    const providers = this.discoveryService.getProviders();
    const messageListeners = providers
      .map((provider) => {
        const type =
          provider.metatype &&
          Reflect.getMetadata(MESSAGE_LISTENER_METADATA, provider.metatype);
        if (type) {
          return {
            instance: provider.instance,
            name: type,
          };
        }
      })
      .filter(Boolean);
    if (messageListeners.length === 0) {
      return;
    }

    messageListeners.forEach(
      (messageListener: { name: string; instance: MessageHandler }) => {
        this.messageConsumer.registerHandler({
          messageName: messageListener.name,
          handler: messageListener.instance,
        });
      },
    );

    worker.run();
  }

  // TODO add forRootAsync that will use injected QUEUE_OPTIONS to bull worker
  // provide proper queue consumer
  // might not need to use useFactory
  static forRoot() {
    const providers = [
      {
        provide: MessageConsumer,
        useClass: BullMessageConsumer,
      },
    ];
    const exports = [MessageConsumer];

    return {
      module: MessagingConsumerModule,
      imports: [DiscoveryModule],
      providers: [...providers],
      exports: [...exports],
    };
  }
}
