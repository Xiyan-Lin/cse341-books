// The public book ID is a string such as "b1", not MongoDB's ObjectId.
const getAllBooks = async (db) => {
  return await db.collection('books')
    .find({}, { projection: { _id: 0 } })
    .toArray();
};

export { getAllBooks };
