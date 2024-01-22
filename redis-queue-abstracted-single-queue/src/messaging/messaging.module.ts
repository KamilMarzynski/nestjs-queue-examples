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
}
