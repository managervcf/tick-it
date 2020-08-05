import { Request, Response, Router } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@tick-it/common';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const cancelOrderRouter = Router();

cancelOrderRouter.patch(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const foundOrder = await Order.findById(orderId).populate('ticket');

    if (!foundOrder) {
      throw new NotFoundError();
    }

    if (foundOrder.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    foundOrder.status = OrderStatus.Cancelled;
    await foundOrder.save();

    // Publish an event saying this order was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: foundOrder.id,
      version: foundOrder.version,
      ticket: {
        id: foundOrder.ticket.id,
      },
    });

    res.status(202).send(foundOrder);
  }
);

export { cancelOrderRouter };
