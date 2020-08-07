import { Publisher, Subjects, ExpirationCompletedEvent } from '@tick-it/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompletedEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
