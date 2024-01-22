import { Message } from '../messaging/types';

export interface TestMessageData {
  test: string;
}

export class TestMessage implements Message<TestMessageData> {
  public name = this.constructor.name;
  constructor(public readonly data: TestMessageData) {}
}
