export type Message<T> = {
  name: string;
  data?: T;
};

export type MessagingMode = 'consumer' | 'producer';
