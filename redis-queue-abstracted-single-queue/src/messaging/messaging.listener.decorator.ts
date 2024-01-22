import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import { Message } from './types';

export const MESSAGE_LISTENER_METADATA = 'MESSAGE_LISTENER';

export function MessageListener(
  message: Message<any> | (new (...args: any[]) => Message<any>),
) {
  return applyDecorators(
    SetMetadata(MESSAGE_LISTENER_METADATA, message.name),
    Injectable,
  );
}
