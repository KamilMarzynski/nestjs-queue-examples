import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { Worker } from 'bullmq';
import { MessageConsumer } from './message.consumer';
import { DiscoveryModule, DiscoveryService } from '@nestjs/core';
import { MESSAGE_LISTENER_METADATA } from './messaging.listener.decorator';
import { MessageHandler } from './message.handler';

export type MessagingModuleOptions = {
  mode: ('producer' | 'consumer')[];
  connectionUrl: `redis://${string}:${string}`;
  queueName: string;
};

const CONSUMER_QUEUE_OPTIONS = Symbol.for('CONSUMER_QUEUE_OPTIONS');

@Module({})
export class MessagingConsumerModule implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly messageConsumer: MessageConsumer,
    @Inject(CONSUMER_QUEUE_OPTIONS)
    private readonly queueOptions: MessagingModuleOptions,
  ) {}

  onModuleInit() {
    if (!this.queueOptions.mode.includes('consumer')) {
      return;
    }

    const redisConfig = this.fromOptionsToRedisConfig(this.queueOptions);

    const worker = new Worker(
      this.queueOptions.queueName,
      async (job) => {
        console.log('Received message', { name: job.name, data: job.data });
        await this.messageConsumer.processMessageOnHandlers({
          name: job.name,
          data: job.data,
        });
      },
      {
        autorun: false,
        connection: redisConfig,
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

  private fromOptionsToRedisConfig(options: MessagingModuleOptions) {
    const url = options.connectionUrl.split('redis://')[1];
    const host = url.split(':')[0];
    const port = url.split(':')[1];

    return {
      host,
      port: parseInt(port, 10),
    };
  }

  static forRoot(options: MessagingModuleOptions) {
    return {
      module: MessagingConsumerModule,
      providers: [
        MessageConsumer,
        {
          provide: CONSUMER_QUEUE_OPTIONS,
          useValue: options,
        },
      ],
      imports: [DiscoveryModule],
    };
  }

  static async forRootAsync(options: {
    useFactory: (...args: any) => Promise<MessagingModuleOptions>;
    inject: any[];
    imports?: any[];
  }) {
    const asyncProviders = await this.resolveAsyncProviders(options);

    return {
      module: MessagingConsumerModule,
      providers: [MessageConsumer, ...asyncProviders],
      imports: [...options.imports, DiscoveryModule],
    };
  }

  private static async resolveAsyncProviders(options: {
    useFactory: (...args: any) => Promise<MessagingModuleOptions>;
    inject: any[];
    imports?: any[];
  }) {
    return [
      {
        provide: CONSUMER_QUEUE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject,
      },
    ];
  }
}
