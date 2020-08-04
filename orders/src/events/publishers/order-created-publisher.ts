import { Publisher, Subjects, OrderCreatedEvent } from '@tick-it/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
