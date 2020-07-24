import { Publisher, Subjects, TicketUpdatedEvent } from '@tick-it/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
