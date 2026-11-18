const authors = (db) => {return db.collection('authors')};

const getAllAuthors = async (db) => {
  return await authors(db).find({}, { projection: { _id: 0 } }).toArray();
};

const getAuthorById = async (db, id) => {
  return await authors(db).findOne({ id }, { projection: { _id: 0 } });
};

const createAuthor = async (db, author) => {
  return await authors(db).insertOne(author);
};

const updateAuthor = async (db, id, values) => {
  return await authors(db).updateOne({ id }, { $set: values });
};

const deleteAuthor = async (db, id) => {
  return await authors(db).deleteOne({ id });
};

const authorHasBooks = async (db, id) => {
  return (await db.collection('books').countDocuments({ authorId: id })) > 0;
};

export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor, authorHasBooks };
