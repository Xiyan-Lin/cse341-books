import { Router } from 'express';
import { createBooksController } from '../controllers/books.js';

const createBooksRouter = (getDatabase) => {
  const router = Router();
  const controller = createBooksController(getDatabase);

  router.get('/', controller.listBooks);
  return router;
};

export { createBooksRouter };
