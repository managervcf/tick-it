import { Request, Response, Router } from 'express';
import { requireAuth } from '@tick-it/common';
import { Order } from '../models/order';

const indexOrderRouter = Router();

indexOrderRouter.get(
  '/api/orders',
  requireAuth,
  async (req: Request, res: Response) => {
    const foundOrders = await Order.find({
      userId: req.currentUser!.id,
    }).populate('ticket');

    res.send(foundOrders);
  }
);

export { indexOrderRouter };
