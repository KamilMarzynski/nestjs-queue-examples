import { Module, OnModuleInit } from '@nestjs/common';
import { BullMessageConsumer } from './bull/bull.queue.consumer';
import { MessageConsumer } from './message.consumer';
import { DiscoveryModule } from '@nestjs/core';

export type MessagingModuleOptions = {
  mode: ('producer' | 'consumer')[];
  connectionUrl: `redis://${string}:${string}`;
};

@Module({})
export class MessagingConsumerModule implements OnModuleInit {
  constructor(private readonly messageConsumer: MessageConsumer) {}

  onModuleInit() {
    console.log('MessagingConsumerModule has been initialized.');

    this.messageConsumer.registerHandler({
      messageName: 'message',
      handler: (message) => {
        console.log('message', message);
      },
    });
  }

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
