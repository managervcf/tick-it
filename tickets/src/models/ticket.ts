import { Schema, model, Document, Model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
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
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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

// Rename version key from __v to verison
ticketSchema.set('versionKey', 'version');

// Apply plugin to manage version control
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attributes: TicketAttributes) =>
  new Ticket(attributes);

export const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);
