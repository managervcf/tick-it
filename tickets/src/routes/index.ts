import { Request, Response, Router, request } from 'express';
import { Ticket } from '../models/ticket';

const getTicketsRouter = Router();

getTicketsRouter.get(
  '/api/tickets',
  async (request: Request, res: Response) => {
    const tickets = await Ticket.find({
      orderId: undefined,
    });
    res.send(tickets);
  }
);

export { getTicketsRouter };
