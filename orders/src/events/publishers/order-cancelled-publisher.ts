import { Publisher, Subjects, OrderCancelledEvent } from '@tick-it/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
