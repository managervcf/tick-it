import { Request, Response, Router } from 'express';

const showOrderRouter = Router();

showOrderRouter.get(
  '/api/orders/:orderId',
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { showOrderRouter };
