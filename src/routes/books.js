import { Router } from 'express';
import { createBooksController } from '../controllers/books.js';

const createBooksRouter = (getDatabase) => {
  const router = Router();
  const controller = createBooksController(getDatabase);

  router.get('/', controller.listBooks);
  router.get('/:id', controller.getBook);
  return router;
};

export { createBooksRouter };
