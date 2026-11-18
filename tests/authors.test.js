import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../app.js';

const authors = [
  { id: 'a1', name: 'Jane Austen', birthYear: 1775 },
  { id: 'a2', name: 'Mary Shelley', birthYear: 1797 }
];
const books = [{ id: 'b1', authorId: 'a1' }];

const fakeDb = (fail = false) => {
  const crash = () => { if (fail) throw new Error('sensitive database failure'); };
  return {
    collection: (collectionName) => {
      const records = collectionName === 'authors' ? authors : books;
      return {
        find: () => {return { toArray: async () => { crash(); return structuredClone(records); } }},
        findOne: async ({ id }) => { crash(); return structuredClone(records.find((x) => {return x.id === id}) || null); },
        countDocuments: async ({ authorId }) => { crash(); return records.filter((x) => {return x.authorId === authorId}).length; },
        insertOne: async (doc) => { crash(); records.push(doc); return { insertedId: 'fake' }; },
        updateOne: async ({ id }, { $set }) => {
          crash(); const target = records.find((x) => {return x.id === id});
          if (!target) return { matchedCount: 0 };
          Object.assign(target, $set); return { matchedCount: 1 };
        },
        deleteOne: async ({ id }) => {
          crash(); const i = records.findIndex((x) => {return x.id === id});
          if (i < 0) return { deletedCount: 0 };
          records.splice(i, 1); return { deletedCount: 1 };
        }
      };
    }
  };
};

const request = async (db, path, method = 'GET', body) => {
  const server = createApp(() => {return db}).listen(0);
  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined
    });
    return { status: response.status, body: response.status === 204 ? null : await response.json() };
  } finally {
    await new Promise((resolve) => { server.close(resolve); });
  }
};

test('Author GET list and single success, missing and 500', async () => {
  const db = fakeDb();
  assert.equal((await request(db, '/authors')).status, 200);
  assert.equal((await request(db, '/authors/a1')).body.name, 'Jane Austen');
  assert.equal((await request(db, '/authors/none')).status, 404);
  assert.deepEqual((await request(fakeDb(true), '/authors/a1')).body, { message: 'Internal server error' });
});

test('Author POST validates required values, duplicates and creates', async () => {
  const db = fakeDb();
  assert.equal((await request(db, '/authors', 'POST', { id: 'a3' })).status, 400);
  assert.equal((await request(db, '/authors', 'POST', authors[0])).status, 400);
  assert.equal((await request(db, '/authors', 'POST', { id: 'a4', name: 'Example', birthYear: 1980 })).status, 201);
});

test('Author PUT validates, returns 404 and updates existing', async () => {
  const db = fakeDb();
  assert.equal((await request(db, '/authors/a1', 'PUT', { name: '' })).status, 400);
  assert.equal((await request(db, '/authors/none', 'PUT', { name: 'Name', birthYear: 1980 })).status, 404);
  const update = await request(db, '/authors/a2', 'PUT', { name: 'Updated', birthYear: 1800 });
  assert.equal(update.status, 200);
  assert.equal(update.body.name, 'Updated');
});

test('Author DELETE blocks referenced author and deletes unreferenced', async () => {
  const db = fakeDb();
  assert.equal((await request(db, '/authors/a1', 'DELETE')).status, 409);
  assert.equal((await request(db, '/authors/unknown', 'DELETE')).status, 404);
  assert.equal((await request(db, '/authors/a2', 'DELETE')).status, 204);
});
