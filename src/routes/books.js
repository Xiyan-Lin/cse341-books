import { Router } from 'express';
import { createBooksController } from '../controllers/books.js';

const createBooksRouter = (getDatabase) => {
  const router = Router();
  const controller = createBooksController(getDatabase);

  /**
   * @openapi
   * /books:
   *   get:
   *     summary: List books
   *     tags:
   *     - Books
   *     responses:
   *       '200':
   *         description: All books returned
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BookList'
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/', controller.listBooks);
  /**
   * @openapi
   * /books/{id}:
   *   get:
   *     summary: Get book by id
   *     tags:
   *     - Books
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       schema:
   *         type: string
   *     responses:
   *       '200':
   *         description: Book returned
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Book'
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/:id', controller.getBook);
  return router;
};

export { createBooksRouter };
