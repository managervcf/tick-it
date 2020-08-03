import { Request, Response, Router } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@tick-it/common';
import { Order } from '../models/order';

const showOrderRouter = Router();

showOrderRouter.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const foundOrder = await Order.findById(req.params.orderId).populate(
      'ticket'
    );

    if (!foundOrder) {
      throw new NotFoundError();
    }

    if (foundOrder.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(foundOrder);
  }
);

export { showOrderRouter };
