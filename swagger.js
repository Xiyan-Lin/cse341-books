import { writeFileSync } from 'node:fs';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'CSE341 Books and Authors API',
      version: '2.0.0',
      description: 'Week 02 MongoDB CRUD API'
    },
    servers: [{ url: '/', description: 'Current server' }],
    components: {
      schemas: {
        Author: {
          type: 'object', required: ['id', 'name', 'birthYear'],
          properties: { id: { type: 'string' }, name: { type: 'string' }, birthYear: { type: 'integer' } }
        },
        Book: {
          type: 'object', required: ['id', 'authorId', 'title', 'publicationDate'],
          properties: {
            id: { type: 'string' }, authorId: { type: 'string' },
            title: { type: 'string' }, publicationDate: { type: 'string' }
          }
        },
        Error: {
          type: 'object', required: ['message'],
          properties: { message: { type: 'string' } }
        },
        AuthorList: { type: 'array', items: { $ref: '#/components/schemas/Author' } },
        BookList: { type: 'array', items: { $ref: '#/components/schemas/Book' } }
      }
    }
  },
  apis: ['./src/routes/authors.js', './src/routes/books.js']
};
const spec = swaggerJsdoc(options);
writeFileSync('./swagger.json', JSON.stringify(spec, null, 2));
console.log('Swagger documentation generated.');
