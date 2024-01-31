import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageController } from './producer.controller';
import { MessagingModule } from '../messaging/messaging.module';

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
  controllers: [MessageController],
})
export class ProducerModule {}
