import { Router } from 'express';
import { createAuthorsController } from '../controllers/authors.js';

const createAuthorsRouter = (getDatabase) => {
  const router = Router();
  const controller = createAuthorsController(getDatabase);
  /**
   * @openapi
   * /authors:
   *   get:
   *     summary: List authors
   *     tags:
   *     - Authors
   *     responses:
   *       '200':
   *         description: All authors returned
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthorList'
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/', controller.listAuthors);
  /**
   * @openapi
   * /authors/{id}:
   *   get:
   *     summary: Get author by id
   *     tags:
   *     - Authors
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       schema:
   *         type: string
   *     responses:
   *       '200':
   *         description: Author returned
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Author'
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
  router.get('/:id', controller.getAuthor);
  /**
   * @openapi
   * /authors:
   *   post:
   *     summary: Create author
   *     tags:
   *     - Authors
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Author'
   *     responses:
   *       '201':
   *         description: Author created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Author'
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
  router.post('/', controller.addAuthor);
  /**
   * @openapi
   * /authors/{id}:
   *   put:
   *     summary: Update author
   *     tags:
   *     - Authors
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
   *             - name
   *             - birthYear
   *             properties:
   *               name:
   *                 type: string
   *                 example: Jane Austen
   *               birthYear:
   *                 type: integer
   *                 example: 1775
   *     responses:
   *       '200':
   *         description: Author updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Author'
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
  router.put('/:id', controller.editAuthor);
  /**
   * @openapi
   * /authors/{id}:
   *   delete:
   *     summary: Delete author
   *     tags:
   *     - Authors
   *     parameters:
   *     - in: path
   *       name: id
   *       required: true
   *       schema:
   *         type: string
   *     responses:
   *       '204':
   *         description: Author deleted, no response body
   *       '404':
   *         description: Resource not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       '409':
   *         description: Author still has books
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
  router.delete('/:id', controller.removeAuthor);
  return router;
};

export { createAuthorsRouter };
