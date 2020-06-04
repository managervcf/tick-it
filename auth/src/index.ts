import express from 'express';
import { json } from 'body-parser';

const app = express();

app.use(json());

// Route handlers
app.get('/api/users/currentuser', (req, res) => {
  res.send('Hithere');
});

const port = 3000;
app.listen(port, () => console.log(`(Auth) Listening on port ${port}...`));
