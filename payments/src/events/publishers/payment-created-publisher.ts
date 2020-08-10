import { Publisher, PaymentCreatedEvent, Subjects } from '@tick-it/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
