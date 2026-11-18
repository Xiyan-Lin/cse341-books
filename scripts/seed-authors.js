import { connectToDb, closeDb } from '../src/db/connect.js';

const authors = [
  { id: 'a1', name: 'Jane Austen', birthYear: 1775 },
  { id: 'a2', name: 'Mary Shelley', birthYear: 1797 },
  { id: 'a3', name: 'George Orwell', birthYear: 1903 }
];

try {
  const db = await connectToDb();
  await db.collection('authors').createIndex({ id: 1 }, { unique: true });
  for (const author of authors) {
    await db.collection('authors').updateOne({ id: author.id }, { $set: author }, { upsert: true });
  }
  console.log('Seeded three authors in cse341-books-db.authors');
} catch (error) {
  console.error('Author seed failed:', error.message);
  process.exitCode = 1;
} finally {
  await closeDb();
}
