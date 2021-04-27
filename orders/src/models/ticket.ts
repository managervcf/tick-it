import { Schema, Document, Model, model } from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttributes {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDoc> {
  build(attributes: TicketAttributes): TicketDoc;
  findByIdAndUpdateIfVersionMatches(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
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

// Change version key
ticketSchema.set('versionKey', 'version');

// Apply plugin
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attributes: TicketAttributes) =>
  new Ticket({
    _id: attributes.id,
    ...attributes,
  });

// Custom model static method updating record if the version matches
ticketSchema.statics.findByIdAndUpdateIfVersionMatches = async (event: {
  id: string;
  version: number;
}) =>
  await Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });

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
    // @ts-ignore
    ticket: this,
    status: {
      // Find ordet where the status is anything but cancelled
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  // Return a boolean
  return !!existingOrder;
};

export const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);
