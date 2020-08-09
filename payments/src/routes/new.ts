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

    res.status(201).send({ success: true });
  }
);

export { createChargeRouter };
