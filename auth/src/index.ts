import express from 'express';
import { json } from 'body-parser';
import {
  currentUserRouter,
  signUpRouter,
  signInRouter,
  signOutRouter,
} from './routes';

const app = express();

app.use(json());
app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

const port = 3000;
app.listen(port, () => console.log(`(Auth) Listening on port ${port}...`));
