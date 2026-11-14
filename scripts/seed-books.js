import { connectToDb, closeDb } from '../src/db/connect.js';

const books = [
  { id: 'b1', author: 'Jane Austen', title: 'Pride and Prejudice', publicationDate: '1813-01-28' },
  { id: 'b2', author: 'Mary Shelley', title: 'Frankenstein', publicationDate: '1818-01-01' },
  { id: 'b3', author: 'George Orwell', title: 'Nineteen Eighty-Four', publicationDate: '1949-06-08' }
];

try {
  const db = await connectToDb();
  const collection = db.collection('books');
  for (const book of books) {
    await collection.updateOne({ id: book.id }, { $set: book }, { upsert: true });
  }
  console.log('Seeded three books in cse341-books-db.books');
} catch (error) {
  console.error('Seeding failed:', error.message);
  process.exitCode = 1;
} finally {
  await closeDb();
}
