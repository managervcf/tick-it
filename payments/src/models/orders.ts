import { Schema, model, Model, Document } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@tick-it/common';

interface OrderAttributtes {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends Model<OrderDoc> {
  build(attributtes: OrderAttributtes): OrderDoc;
}

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attributtes: OrderAttributtes) =>
  new Order({
    _id: attributtes.id,
    version: attributtes.price,
    price: attributtes.price,
    userId: attributtes.userId,
    status: attributtes.status,
  });

const Order = model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
