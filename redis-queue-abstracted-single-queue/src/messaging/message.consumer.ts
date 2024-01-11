import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageConsumer {
  private handlers: Record<string, ((...args) => Promise<any>)[]> = {};

  public registerHandler({ messageName, handler }) {
    if (!this.handlers[messageName]) {
      this.handlers[messageName] = [];
    }
    this.handlers[messageName].push(handler);
  }

  public async processMessageOnHandlers(message: any) {
    const handlers = this.handlers[message];
    if (!handlers) {
      return;
    }
    handlers.forEach((handler) => {
      handler(message);
    });
  }
}
