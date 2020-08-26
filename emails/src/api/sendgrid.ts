import sendgrid from '@sendgrid/mail';
import { PaymentCreatedEvent } from '@tick-it/common';

// Set API key
sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

export class Mail {
  static async send(
    { chargeId, orderId }: PaymentCreatedEvent['data'],
    recipient: string
  ) {
    const email: sendgrid.MailDataRequired = {
      to: recipient,
      from: 'admin@tickit.com',
      subject: `TickIt - Your order number ${orderId}`,
      text: `Conratulations. You bought a ticket. Your payment id is ${chargeId}`,
    };

    await sendgrid.send(email);
  }
}
