import swaggerDocument from './swagger.json' with { type: 'json' };
import express from 'express';
import { getDb } from './src/db/connect.js';
import { createBooksRouter } from './src/routes/books.js';
import { createAuthorsRouter } from './src/routes/authors.js';

let swaggerUi;
try {
  ({ default: swaggerUi } = await import('swagger-ui-express'));
} catch (error) {
  if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
}

const createApp = (getDatabase = getDb) => {
  const app = express();
  app.use(express.json());
  app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Server is running' });
  });
  app.get('/swagger.json', (req, res) => {
    return res.status(200).json(swaggerDocument);
  });
  if (swaggerUi) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } else {
    app.get('/api-docs', (req, res) => {
      return res.status(503).json({ message: 'Install dependencies to enable Swagger UI' });
    });
  }
  app.use('/books', createBooksRouter(getDatabase));
  app.use('/authors', createAuthorsRouter(getDatabase));
  return app;
};

const app = createApp();
export { createApp };
export default app;
