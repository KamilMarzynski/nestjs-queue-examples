import { NestFactory } from '@nestjs/core';
import { ProducerModule } from './producer/producer.module';

async function bootstrap() {
  const app = await NestFactory.create(ProducerModule);
  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
