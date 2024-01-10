import { Injectable } from '@nestjs/common';
import { Message } from './types';

@Injectable()
export abstract class QueueService {
  abstract add<T>(message: Message<T>): Promise<void>;
}
