import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@tick-it/common';
import { Order } from '../models/orders';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const validateBody = [body('token').notEmpty(), body('orderId').notEmpty()];

const createChargeRouter = Router();

createChargeRouter.post(
  '/api/payments',
  requireAuth,
  validateBody,
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    // Find order in the database
    const foundOrder = await Order.findById(orderId);

    // Check if the order exists
    if (!foundOrder) {
      throw new NotFoundError();
    }

    // Check if the order belong to the current user
    if (foundOrder.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Check if order is cancelled
    if (foundOrder.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order has been cancelled');
    }

    // Charge a user
    const charge = await stripe.charges.create({
      amount: foundOrder.price * 100,
      currency: 'usd',
      source: token,
    });

    // Save a payment to the database
    const createdPayment = Payment.build({
      orderId,
      chargeId: charge.id,
    });

    await createdPayment.save();

    // Publish an event saying that an order has been charged
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: createdPayment.id,
      chargeId: createdPayment.chargeId,
      user: req.currentUser!,
      order: {
        id: foundOrder.id,
        price: foundOrder.price,
      },
    });

    res.status(201).send(createdPayment);
  }
);

export { createChargeRouter };
