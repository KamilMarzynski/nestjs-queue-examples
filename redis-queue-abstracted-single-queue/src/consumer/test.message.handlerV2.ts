import { MessageListener } from '../messaging/messaging.listener.decorator';
import { TestMessage, TestMessageData } from '../common/test.message';
import { MessageHandler } from '../messaging/message.handler';

@MessageListener(TestMessage)
export class TestMessageHandlerV2 implements MessageHandler<TestMessage, void> {
  handle(data: TestMessageData): any {
    console.log('TestMessageHandlerV2', data.test);
  }
}
