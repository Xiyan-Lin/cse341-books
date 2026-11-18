import { connectToDb, closeDb } from '../src/db/connect.js';

const authors = [
  { id: 'a1', name: 'Jane Austen', birthYear: 1775 },
  { id: 'a2', name: 'Mary Shelley', birthYear: 1797 },
  { id: 'a3', name: 'George Orwell', birthYear: 1903 }
];
const books = [
  { id: 'b1', authorId: 'a1', title: 'Pride and Prejudice', publicationDate: '1813-01-28' },
  { id: 'b2', authorId: 'a2', title: 'Frankenstein', publicationDate: '1818-01-01' },
  { id: 'b3', authorId: 'a3', title: 'Nineteen Eighty-Four', publicationDate: '1949-06-08' }
];

try {
  const db = await connectToDb();
  await db.collection('authors').createIndex({ id: 1 }, { unique: true });
  await db.collection('books').createIndex({ id: 1 }, { unique: true });
  for (const author of authors) {
    await db.collection('authors').updateOne({ id: author.id }, { $set: author }, { upsert: true });
  }
  for (const book of books) {
    await db.collection('books').updateOne(
      { id: book.id },
      { $set: book, $unset: { author: '' } },
      { upsert: true }
    );
  }
  console.log('Migrated W01 books to authorId references; authors created or updated');
} catch (error) {
  console.error('W02 migration failed:', error.message);
  process.exitCode = 1;
} finally {
  await closeDb();
}
