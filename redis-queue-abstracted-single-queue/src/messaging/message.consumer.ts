import { Injectable } from '@nestjs/common';
import { MessageHandler } from './message.handler';
import { Message } from './types';

@Injectable()
export class MessageConsumer {
  private handlers: Record<string, MessageHandler[]> = {};

  public registerHandler({ messageName, handler }) {
    console.log('Registering handler for message', messageName);
    if (!this.handlers[messageName]) {
      this.handlers[messageName] = [];
    }
    this.handlers[messageName].push(handler);
    console.log('Registered handler for message', this.handlers);
  }

  public async processMessageOnHandlers<T>(message: Message<T>) {
    const handlers = this.handlers[message.name];
    console.log('Processing message on handlers', message.name, handlers);
    if (!handlers) {
      console.log('No handlers for message', message.name);
      return;
    }
    return Promise.all(
      handlers.map(async (handler: MessageHandler) => {
        await handler.handle(message.data);
      }),
    );
  }
}
