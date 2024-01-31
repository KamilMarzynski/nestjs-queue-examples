import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QUEUE_NAME } from '../common/constants';
import { BullMessagingService } from './bull/bull.messaging.service';
import { MessagingService } from './messaging.service';
import { MessagingConsumerModule } from './messaging.consumer.module';

export type MessagingModuleOptions = {
  mode: ('producer' | 'consumer')[];
  connectionUrl: `redis://${string}:${string}`;
};

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
    const opts = await this.resolveAsyncOptions(options);

    const providers = this.getProviders(opts);
    const exports = this.getExports(opts);
    const imports = this.getImports(opts);

    return {
      module: MessagingModule,
      imports: [...(options?.imports ?? []), ...imports],
      providers: [...providers],
      exports: [...exports],
    };
  }

  // TODO: change this to method that provides only QUEUE_OPTIONS
  private static async resolveAsyncOptions(options: {
    useFactory: (...args: any) => Promise<MessagingModuleOptions>;
    inject: any[];
    imports?: any[];
  }) {
    const resolveInjects = options.inject.map((inject) => {
      return new inject();
    });
    return await options.useFactory(...resolveInjects);
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

  private static getProviders(options: MessagingModuleOptions) {
    const providers = [];
    if (options.mode.includes('producer')) {
      providers.push({
        provide: MessagingService,
        // TODO: change this to useFactory
        // and craete manually bull queue
        // inject here QUEUE_OPTIONS from async provider
        useClass: BullMessagingService,
      });
    }
    return providers;
  }

  private static getExports(options: MessagingModuleOptions) {
    const exports = [];
    if (options.mode.includes('producer')) {
      exports.push(MessagingService);
    }
    return exports;
  }

  private static getImports(options: MessagingModuleOptions) {
    const { host, port } = this.fromOptionsToRedisConfig(options);
    // TODO: remove BullModule entirely from this module
    const imports = [
      BullModule.forRoot({
        redis: {
          host,
          port,
        },
      }),
      BullModule.registerQueue({
        name: QUEUE_NAME,
      }),
    ];
    if (options.mode.includes('consumer')) {
      imports.push(MessagingConsumerModule.forRoot());
    }
    return imports;
  }
}
