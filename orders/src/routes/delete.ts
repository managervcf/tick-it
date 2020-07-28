import { Request, Response, Router } from 'express';

const deleteOrderRouter = Router();

deleteOrderRouter.delete(
  '/api/orders/:orderId',
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { deleteOrderRouter };
