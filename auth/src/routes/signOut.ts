import { Router } from 'express';

const signOutRouter = Router();

signOutRouter.post('/api/users/signout', (req, res) => {
  req.session = null;
  res.send({});
});

export { signOutRouter };
