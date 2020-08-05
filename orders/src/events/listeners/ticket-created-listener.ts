import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from '@tick-it/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  /**
   * The onMessage function needs to save the newly created ticket
   * into order's service database. After saving new record to the
   * database, this function needs to call message.ack() to
   * acknowledge the incoming event. That's a classic example of
   * data duplication between microservices.
   *
   * @param data Ticket info
   * @param message NATS message
   */
  async onMessage(data: TicketCreatedEvent['data'], message: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    message.ack();
  }
}
