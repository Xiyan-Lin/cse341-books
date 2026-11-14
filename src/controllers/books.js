import { getAllBooks } from '../models/books.js';

const createBooksController = (getDatabase) => {
  const listBooks = async (req, res) => {
    try {
      const books = await getAllBooks(getDatabase());
      return res.status(200).json(books);
    } catch (error) {
      console.error('Failed to retrieve books:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  return { listBooks };
};

export { createBooksController };
