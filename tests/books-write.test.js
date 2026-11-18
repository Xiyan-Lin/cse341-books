import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../app.js';

const makeDb = (fail = false) => {
  const books = [
    { id: 'b1', authorId: 'a1', title: 'Pride and Prejudice', publicationDate: '1813-01-28' }
  ];
  const authors = [{ id: 'a1', name: 'Jane Austen', birthYear: 1775 }];
  const crash = () => { if (fail) throw new Error('private failure'); };
  return {
    collection: (name) => {
      const rows = name === 'books' ? books : authors;
      return {
        find: () => {return { toArray: async () => { crash(); return structuredClone(rows); } }},
        findOne: async ({ id }) => { crash(); return structuredClone(rows.find((r) => {return r.id === id}) || null); },
        insertOne: async (value) => { crash(); rows.push(value); return { insertedId: 'mock' }; },
        updateOne: async ({ id }, { $set }) => {
          crash(); const target = rows.find((r) => {return r.id === id});
          if (!target) return { matchedCount: 0 };
          Object.assign(target, $set); return { matchedCount: 1 };
        },
        deleteOne: async ({ id }) => {
          crash(); const i = rows.findIndex((r) => {return r.id === id});
          if (i < 0) return { deletedCount: 0 };
          rows.splice(i, 1); return { deletedCount: 1 };
        }
      };
    }
  };
};

const request = async (db, path, method = 'GET', data) => {
  const server = createApp(() => {return db}).listen(0);
  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      method, headers: data ? { 'content-type': 'application/json' } : {},
      body: data ? JSON.stringify(data) : undefined
    });
    return { status: response.status, body: response.status === 204 ? null : await response.json() };
  } finally {
    await new Promise((resolve) => { server.close(resolve); });
  }
};

test('Book GET has authorId', async () => {
  const result = await request(makeDb(), '/books/b1');
  assert.equal(result.status, 200);
  assert.equal(result.body.authorId, 'a1');
});

test('Book POST validates author references and duplicate IDs', async () => {
  const db = makeDb();
  const data = { id: 'b4', authorId: 'a1', title: 'Example', publicationDate: '2026-01-15' };
  assert.equal((await request(db, '/books', 'POST', { id: 'b4' })).status, 400);
  assert.equal((await request(db, '/books', 'POST', { ...data, id: 'b1' })).status, 400);
  assert.equal((await request(db, '/books', 'POST', { ...data, authorId: 'bad' })).status, 400);
  assert.equal((await request(db, '/books', 'POST', { ...data, publicationDate: '2026-02-30' })).status, 400);
  assert.equal((await request(db, '/books', 'POST', data)).status, 201);
});

test('Book PUT validates author references and missing book', async () => {
  const db = makeDb();
  const data = { authorId: 'a1', title: 'Updated', publicationDate: '2026-02-20' };
  assert.equal((await request(db, '/books/b1', 'PUT', { ...data, authorId: 'bad' })).status, 400);
  assert.equal((await request(db, '/books/b1', 'PUT', { title: 'Only' })).status, 400);
  assert.equal((await request(db, '/books/notfound', 'PUT', data)).status, 404);
  assert.equal((await request(db, '/books/b1', 'PUT', data)).status, 200);
});

test('Book DELETE returns 204 and missing 404', async () => {
  const db = makeDb();
  assert.equal((await request(db, '/books/b1', 'DELETE')).status, 204);
  assert.equal((await request(db, '/books/b1', 'DELETE')).status, 404);
});

test('Book unexpected database error returns safe 500', async () => {
  const result = await request(makeDb(true), '/books/b1');
  assert.equal(result.status, 500);
  assert.deepEqual(result.body, { message: 'Internal server error' });
});
