import { Request, Response, Router } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@tick-it/common';
import { Order, OrderStatus } from '../models/order';

const cancelOrderRouter = Router();

cancelOrderRouter.patch(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const foundOrder = await Order.findById(orderId);

    if (!foundOrder) {
      throw new NotFoundError();
    }

    if (foundOrder.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    foundOrder.status = OrderStatus.Cancelled;
    await foundOrder.save();

    // Publish an event saying this order was cancelled

    res.status(202).send(foundOrder);
  }
);

export { cancelOrderRouter };
