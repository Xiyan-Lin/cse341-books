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
  /**
   * @openapi
   * /books:
   *   post:
   *     summary: Create book
   *     tags:
   *     - Books
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Book'
   *     responses:
   *       '201':
   *         description: Book created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Book'
   *       '400':
   *         description: Invalid or missing fields, duplicate id, or invalid author reference
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
  router.post('/', controller.addBook);
  /**
   * @openapi
   * /books/{id}:
   *   put:
   *     summary: Update book
   *     tags:
   *     - Books
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       schema:
   *         type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *             - authorId
   *             - title
   *             - publicationDate
   *             properties:
   *               authorId:
   *                 type: string
   *                 example: a1
   *               title:
   *                 type: string
   *                 example: Pride and Prejudice
   *               publicationDate:
   *                 type: string
   *                 example: '1813-01-28'
   *     responses:
   *       '200':
   *         description: Book updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Book'
   *       '400':
   *         description: Missing or invalid fields
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
  router.put('/:id', controller.editBook);
  /**
   * @openapi
   * /books/{id}:
   *   delete:
   *     summary: Delete book
   *     tags:
   *     - Books
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       schema:
   *         type: string
   *     responses:
   *       '204':
   *         description: Book deleted, no response body
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
  router.delete('/:id', controller.removeBook);
  return router;
};

export { createBooksRouter };
