import {
  getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor, authorHasBooks
} from '../models/authors.js';

const validId = (value) => {return typeof value === 'string' && value.trim().length > 0};
const validName = (value) => {return typeof value === 'string' && value.trim().length > 0};
const validBirthYear = (value) => {return Number.isInteger(value) && value >= 0 && value <= new Date().getFullYear()};
const safeError = (res, error) => {
  console.error('Author database error:', error.message);
  return res.status(500).json({ message: 'Internal server error' });
};

const createAuthorsController = (getDatabase) => {
  const listAuthors = async (req, res) => {
    try {
      return res.status(200).json(await getAllAuthors(getDatabase()));
    } catch (error) {
      return safeError(res, error);
    }
  };

  const getAuthor = async (req, res) => {
    try {
      const author = await getAuthorById(getDatabase(), req.params.id);
      if (!author) return res.status(404).json({ message: 'Author not found' });
      return res.status(200).json(author);
    } catch (error) {
      return safeError(res, error);
    }
  };

  const addAuthor = async (req, res) => {
    const { id, name, birthYear } = req.body || {};
    if (!validId(id) || !validName(name) || !validBirthYear(birthYear)) {
      return res.status(400).json({ message: 'id, name, and a valid birthYear are required' });
    }
    try {
      const db = getDatabase();
      if (await getAuthorById(db, id)) {
        return res.status(400).json({ message: 'Author id already exists' });
      }
      const author = { id, name, birthYear };
      await createAuthor(db, author);
      return res.status(201).json(author);
    } catch (error) {
      if (error.code === 11000) return res.status(400).json({ message: 'Author id already exists' });
      return safeError(res, error);
    }
  };

  const editAuthor = async (req, res) => {
    const { name, birthYear } = req.body || {};
    if (!validName(name) || !validBirthYear(birthYear)) {
      return res.status(400).json({ message: 'name and a valid birthYear are required' });
    }
    try {
      const db = getDatabase();
      const result = await updateAuthor(db, req.params.id, { name, birthYear });
      if (result.matchedCount === 0) return res.status(404).json({ message: 'Author not found' });
      return res.status(200).json({ id: req.params.id, name, birthYear });
    } catch (error) {
      return safeError(res, error);
    }
  };

  const removeAuthor = async (req, res) => {
    try {
      const db = getDatabase();
      if (!await getAuthorById(db, req.params.id)) {
        return res.status(404).json({ message: 'Author not found' });
      }
      if (await authorHasBooks(db, req.params.id)) {
        return res.status(409).json({ message: 'Cannot delete author with books' });
      }
      const result = await deleteAuthor(db, req.params.id);
      if (result.deletedCount === 0) return res.status(404).json({ message: 'Author not found' });
      return res.status(204).send();
    } catch (error) {
      return safeError(res, error);
    }
  };
  return { listAuthors, getAuthor, addAuthor, editAuthor, removeAuthor };
};

export { createAuthorsController };
