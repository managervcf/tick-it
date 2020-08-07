import { Publisher, Subjects, ExpirationCompleteEvent } from '@tick-it/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
