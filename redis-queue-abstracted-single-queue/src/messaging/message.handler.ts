import { Message } from './types';

export interface MessageHandler<
  TMessage extends Message<any> = any,
  TResult = any,
> {
  handle(data?: TMessage['data']): Promise<TResult>;
}
