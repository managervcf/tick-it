import { Request, Response, Router, request } from 'express';
import { Ticket } from '../models/Ticket';

const getTicketsRouter = Router();

getTicketsRouter.get(
  '/api/tickets',
  async (request: Request, res: Response) => {
    const tickets = await Ticket.find({});
    res.send(tickets);
  }
);

export { getTicketsRouter };
