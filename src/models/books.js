const getAllBooks = async (db) => {
  return await db.collection('books').find({}, { projection: { _id: 0 } }).toArray();
};

const getBookById = async (db, id) => {
  return await db.collection('books').findOne({ id }, { projection: { _id: 0 } });
};

const authorExists = async (db, id) => {
  return await db.collection('authors').findOne({ id }, { projection: { _id: 0 } });
};

const createBook = async (db, book) => {
  return await db.collection('books').insertOne(book);
};

const updateBook = async (db, id, values) => {
  return await db.collection('books').updateOne({ id }, { $set: values });
};

const deleteBook = async (db, id) => {
  return await db.collection('books').deleteOne({ id });
};

export { getAllBooks, getBookById, authorExists, createBook, updateBook, deleteBook };
