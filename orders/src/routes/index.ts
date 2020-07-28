import { Request, Response, Router } from 'express';

const indexOrderRouter = Router();

indexOrderRouter.get('/api/orders', async (req: Request, res: Response) => {
  res.send({});
});

export { indexOrderRouter };
