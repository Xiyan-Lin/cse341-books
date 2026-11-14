import express from 'express';
import { getDb } from './src/db/connect.js';
import { createBooksRouter } from './src/routes/books.js';

const createApp = (getDatabase = getDb) => {
  const app = express();
  app.use(express.json());

  app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Server is running' });
  });

  app.use('/books', createBooksRouter(getDatabase));
  return app;
};

const app = createApp();
export { createApp };
export default app;
