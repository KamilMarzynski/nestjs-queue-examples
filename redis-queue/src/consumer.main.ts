import { NestFactory } from '@nestjs/core';
import { ConsumerModule } from './consumer/consumer.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ConsumerModule);
  await app.listen();
}
bootstrap();
