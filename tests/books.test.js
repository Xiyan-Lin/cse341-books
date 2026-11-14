import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../app.js';

const records = [
  { id: 'b1', author: 'Jane Austen', title: 'Pride and Prejudice', publicationDate: '1813-01-28' },
  { id: 'b2', author: 'Mary Shelley', title: 'Frankenstein', publicationDate: '1818-01-01' }
];

const fakeDb = (fail = false) => {return {
  collection: () => {return {
    find: () => {return {
      toArray: async () => {
        if (fail) throw new Error('private database error');
        return records;
      }
    }},
    findOne: async ({ id }) => {
      if (fail) throw new Error('private database error');
      return records.find((record) => {return record.id === id}) || null;
    }
  }}
}};

const request = async (db, route) => {
  const server = createApp(() => {return db}).listen(0);
  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}${route}`);
    return { status: response.status, contentType: response.headers.get('content-type'), body: await response.json() };
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) return reject(error);
        return resolve();
      });
    });
  }
};

test('GET /books returns JSON array with HTTP 200', async () => {
  const result = await request(fakeDb(), '/books');
  assert.equal(result.status, 200);
  assert.match(result.contentType, /application\/json/);
  assert.deepEqual(result.body, records);
});

test('GET /books/b1 returns the right book', async () => {
  const result = await request(fakeDb(), '/books/b1');
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, records[0]);
});

test('GET /books/missing returns HTTP 404', async () => {
  const result = await request(fakeDb(), '/books/missing');
  assert.equal(result.status, 404);
  assert.deepEqual(result.body, { message: 'Book not found' });
});

test('GET /books returns safe HTTP 500 message', async () => {
  const result = await request(fakeDb(true), '/books');
  assert.equal(result.status, 500);
  assert.deepEqual(result.body, { message: 'Internal server error' });
});

test('GET /books/b1 returns safe HTTP 500 message', async () => {
  const result = await request(fakeDb(true), '/books/b1');
  assert.equal(result.status, 500);
  assert.deepEqual(result.body, { message: 'Internal server error' });
});
