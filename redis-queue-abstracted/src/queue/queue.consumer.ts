import { Injectable } from '@nestjs/common';
@Injectable()
export class QueueConsumer {
  private handlers: Record<string, ((...args) => any)[]> = {};

  private getHandlerName(queueName: string, messageName: string) {
    return `${queueName}_${messageName}Handler`;
  }
  public registerHandler({ queueName, messageName, handler }) {
    const handlerName = `${queueName}_${messageName}Handler`;
    if (!this.handlers[handlerName]) {
      this.handlers[handlerName] = [];
    }
    this.handlers[handlerName].push(handler);
  }

  public processMessageOnHandlers(queueName: string, message: any) {
    console.log('processMessageOnHandlers', queueName, message);
    const handlerName = this.getHandlerName(queueName, message.name);
    const handlers = this.handlers[handlerName];
    if (!handlers) {
      return;
    }
    handlers.forEach((handler) => {
      handler(message);
    });
  }
}
