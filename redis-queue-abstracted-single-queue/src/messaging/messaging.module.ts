import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QUEUE_NAME } from '../common/constants';
import { BullMessagingService } from './bull/bull.messaging.service';
import { MessagingService } from './messaging.service';
import { MessagingConsumerModule } from './messaging.consumer.module';
import { Queue } from 'bullmq';

export type MessagingModuleOptions = {
  mode: ('producer' | 'consumer')[];
  connectionUrl: `redis://${string}:${string}`;
  queueName: string;
};

const QUEUE_OPTIONS = Symbol.for('QUEUE_OPTIONS');

@Module({})
export class MessagingModule {
  static forRoot(options: MessagingModuleOptions) {
    const url = options.connectionUrl.split('redis://')[1];
    const host = url.split(':')[0];
    const port = url.split(':')[1];

    const providers = [];
    const exports = [];
    const imports = [];

    if (options.mode.includes('producer')) {
      providers.push({
        provide: MessagingService,
        useClass: BullMessagingService,
      });

      exports.push(MessagingService);
    }

    if (options.mode.includes('consumer')) {
      imports.push(MessagingConsumerModule.forRoot());
    }

    return {
      module: MessagingModule,
      imports: [
        ...imports,
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

  static async forRootAsync(options: {
    useFactory: (...args: any) => Promise<MessagingModuleOptions>;
    inject: any[];
    imports?: any[];
  }) {
    const asyncProviders = await this.resolveAsyncProviders(options);

    const providers = this.getProviders();

    return {
      module: MessagingModule,
      imports: [...(options?.imports ?? [])],
      providers: [...asyncProviders, ...providers],
      exports: [QUEUE_OPTIONS, MessagingService],
    };
  }

  private static async resolveAsyncProviders(options: {
    useFactory: (...args: any) => Promise<MessagingModuleOptions>;
    inject: any[];
    imports?: any[];
  }) {
    return [
      {
        provide: QUEUE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject,
      },
    ];
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

  private static getProviders() {
    const providers = [];
    providers.push({
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
    });
    return providers;
  }

  // private static getImports(options: MessagingModuleOptions) {
  //   const imports = [];
  //   if (options.mode.includes('consumer')) {
  //     imports.push(MessagingConsumerModule.forRoot());
  //   }
  //   return imports;
  // }
}
