import { Schema, Document, Model, model } from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttributes {
  title: string;
  price: number;
}

export interface TicketDoc extends Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDoc> {
  build(attributes: TicketAttributes): TicketDoc;
}

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attributes: TicketAttributes) =>
  new Ticket(attributes);

/**
 * Make sure that the ticket is not already reserved
 * Run query to look at all orders. Find an order where
 * the ticket is the ticket we just found *and* the orders
 * status is not cancelled. If we find an order from that
 * means the ticket *is* reserved.
 * */
ticketSchema.methods.isReserved = async function () {
  // 'this' === the ticket document thatwe just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      // Find ordet where the status is anything but cancelled
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Completed,
      ],
    },
  });

  // Return a boolean
  return !!existingOrder;
};

export const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);
