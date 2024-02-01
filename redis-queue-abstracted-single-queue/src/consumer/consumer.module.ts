import { Module } from '@nestjs/common';
import { MessagingModule } from '../messaging/messaging.module';
import { TestMessageHandler } from './test.message.handler';
import { TestMessageHandlerV2 } from './test.message.handlerV2';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MessagingModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          mode: [configService.get('MODE')],
          connectionUrl: configService.get('QUEUE_URL'),
          queueName: configService.get('QUEUE_NAME'),
        };
      },
    }),
  ],
  providers: [TestMessageHandler, TestMessageHandlerV2],
})
export class ConsumerModule {}
