import { Module } from '@nestjs/common';
import { BullMessagingService } from './bull/bull.messaging.service';
import { MessagingService } from './messaging.service';
import { MessagingConsumerModule } from './messaging.consumer.module';
import { Queue } from 'bullmq';

export type MessagingModuleOptions = {
  mode: ('producer' | 'consumer')[];
  connectionUrl: `redis://${string}:${string}`;
  queueName: string;
};

export const QUEUE_OPTIONS = Symbol.for('QUEUE_OPTIONS');

@Module({})
export class MessagingModule {
  static forRoot(options: MessagingModuleOptions) {
    const providers = this.getProviders(options);

    return {
      module: MessagingModule,
      imports: [MessagingConsumerModule.forRoot(options)],
      providers: [...providers],
      exports: [MessagingService],
    };
  }

  static async forRootAsync(options: {
    useFactory: (...args: any) => Promise<MessagingModuleOptions>;
    inject: any[];
    imports?: any[];
  }) {
    const asyncProviders = await this.resolveAsyncProviders(options);

    return {
      module: MessagingModule,
      imports: [
        ...(options?.imports ?? []),
        MessagingConsumerModule.forRootAsync(options),
      ],
      providers: [...asyncProviders],
      exports: [QUEUE_OPTIONS, MessagingService],
    };
  }

  private static getProviders(options: MessagingModuleOptions) {
    const providers = [];
    const config = this.fromOptionsToRedisConfig(options);

    const queue = new Queue(options.queueName, {
      connection: {
        host: config.host,
        port: config.port,
      },
    });
    const bullMessagingService = new BullMessagingService(queue);

    providers.push({
      provide: MessagingService,
      useExisting: bullMessagingService,
    });
    return providers;
  }

  private static async resolveAsyncProviders(options: {
    useFactory: (...args: any) => Promise<MessagingModuleOptions>;
    inject: any[];
    imports?: any[];
  }) {
    const optionsProvider = await this.resolveAsyncOptions(options);
    return [
      optionsProvider,
      {
        provide: MessagingService,
        useFactory: (options: MessagingModuleOptions) => {
          const config = this.fromOptionsToRedisConfig(options);
          const queue = new Queue(options.queueName, {
            connection: {
              host: config.host,
              port: config.port,
            },
          });
          return new BullMessagingService(queue);
        },
        inject: [QUEUE_OPTIONS],
      },
    ];
  }

  private static async resolveAsyncOptions(options: {
    useFactory: (...args: any) => Promise<MessagingModuleOptions>;
    inject: any[];
    imports?: any[];
  }) {
    return {
      provide: QUEUE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    };
  }

  private static fromOptionsToRedisConfig(options: MessagingModuleOptions) {
    const url = options.connectionUrl.split('redis://')[1];
    const host = url.split(':')[0];
    const port = url.split(':')[1];

    return {
      host,
      port: parseInt(port, 10),
    };
  }
}
