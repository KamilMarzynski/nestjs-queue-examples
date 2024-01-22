import { Module, OnModuleInit } from '@nestjs/common';
import { BullMessageConsumer } from './bull/bull.queue.consumer';
import { MessageConsumer } from './message.consumer';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { MESSAGE_LISTENER_METADATA } from './messaging.listener.decorator';
import { MessageHandler } from './message.handler';

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

  onModuleInit() {
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
