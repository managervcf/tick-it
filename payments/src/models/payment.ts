import { Schema, model, Document, Model } from 'mongoose';

interface PaymentAttributtes {
  orderId: string;
  chargeId: string;
}

interface PaymentDoc extends Document {
  orderId: string;
  chargeId: string;
}

interface PaymentModel extends Model<PaymentDoc> {
  build(attributtes: PaymentAttributtes): PaymentDoc;
}

const paymentSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    chargeId: {
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

paymentSchema.statics.build = (attributtes: PaymentAttributtes) =>
  new Payment(attributtes);

const Payment = model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };
