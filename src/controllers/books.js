import {
  getAllBooks, getBookById, authorExists, createBook, updateBook, deleteBook
} from '../models/books.js';

const isNonempty = (s) => {return typeof s === 'string' && s.trim().length > 0};
const validDate = (s) => {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const date = new Date(`${s}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === s;
};
const validBookInput = ({ authorId, title, publicationDate }) => {
  return isNonempty(authorId) && isNonempty(title) && validDate(publicationDate);
};
const safeError = (res, error) => {
  console.error('Book database error:', error.message);
  return res.status(500).json({ message: 'Internal server error' });
};

const createBooksController = (getDatabase) => {
  const listBooks = async (req, res) => {
    try {
      return res.status(200).json(await getAllBooks(getDatabase()));
    } catch (error) {
      return safeError(res, error);
    }
  };

  const getBook = async (req, res) => {
    try {
      const book = await getBookById(getDatabase(), req.params.id);
      if (!book) return res.status(404).json({ message: 'Book not found' });
      return res.status(200).json(book);
    } catch (error) {
      return safeError(res, error);
    }
  };

  const addBook = async (req, res) => {
    const { id, authorId, title, publicationDate } = req.body || {};
    if (!isNonempty(id) || !validBookInput({ authorId, title, publicationDate })) {
      return res.status(400).json({ message: 'id, authorId, title, and a valid publicationDate are required' });
    }
    try {
      const db = getDatabase();
      if (await getBookById(db, id)) return res.status(400).json({ message: 'Book id already exists' });
      if (!await authorExists(db, authorId)) {
        return res.status(400).json({ message: 'authorId must reference an existing author' });
      }
      const book = { id, authorId, title, publicationDate };
      await createBook(db, book);
      return res.status(201).json(book);
    } catch (error) {
      if (error.code === 11000) return res.status(400).json({ message: 'Book id already exists' });
      return safeError(res, error);
    }
  };

  const editBook = async (req, res) => {
    const { authorId, title, publicationDate } = req.body || {};
    if (!validBookInput({ authorId, title, publicationDate })) {
      return res.status(400).json({ message: 'authorId, title, and a valid publicationDate are required' });
    }
    try {
      const db = getDatabase();
      if (!await getBookById(db, req.params.id)) return res.status(404).json({ message: 'Book not found' });
      if (!await authorExists(db, authorId)) {
        return res.status(400).json({ message: 'authorId must reference an existing author' });
      }
      const result = await updateBook(db, req.params.id, { authorId, title, publicationDate });
      if (result.matchedCount === 0) return res.status(404).json({ message: 'Book not found' });
      return res.status(200).json({ id: req.params.id, authorId, title, publicationDate });
    } catch (error) {
      return safeError(res, error);
    }
  };

  const removeBook = async (req, res) => {
    try {
      const result = await deleteBook(getDatabase(), req.params.id);
      if (result.deletedCount === 0) return res.status(404).json({ message: 'Book not found' });
      return res.status(204).send();
    } catch (error) {
      return safeError(res, error);
    }
  };

  return { listBooks, getBook, addBook, editBook, removeBook };
};

export { createBooksController };
