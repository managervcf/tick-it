import { Request, Response, Router } from 'express';

const createOrderRouter = Router();

createOrderRouter.post('/api/orders', async (req: Request, res: Response) => {
  res.send({});
});

export { createOrderRouter };
