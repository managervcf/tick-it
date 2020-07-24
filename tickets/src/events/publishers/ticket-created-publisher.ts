import { Publisher, Subjects, TicketCreatedEvent } from '@tick-it/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
