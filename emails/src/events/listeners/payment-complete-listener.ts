import { Message } from 'node-nats-streaming';
import { Listener, PaymentCreatedEvent, Subjects } from '@tick-it/common';
import { queueGroupName } from './queue-group-name';
import { Mail } from '../../api/sendgrid';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  onMessage(data: PaymentCreatedEvent['data'], message: Message) {
    // Save payment to the database

    // Send email to the user
    Mail.send(data, 'managervcf@gmail.com');

    // Acknowledge the message
    message.ack();
  }
}
