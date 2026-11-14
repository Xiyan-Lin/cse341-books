import { MongoClient } from 'mongodb';
import dns from 'node:dns';

let database;
let client;

const connectToDb = async () => {
  const connectionString = process.env.MONGODB_URI;
  if (!connectionString) {
    throw new Error('MONGODB_URI is required.');
  }

  // Optional Windows DNS workaround. Leave unset on Render unless necessary.
  if (process.env.MONGODB_DNS_SERVERS) {
    dns.setServers(process.env.MONGODB_DNS_SERVERS.split(',').map((x) => {return x.trim()}));
  }

  client = new MongoClient(connectionString, { serverSelectionTimeoutMS: 10000 });
  await client.connect();
  database = client.db(process.env.MONGODB_DB_NAME || 'cse341-books-db');
  console.log('Successfully connected to MongoDB!');
  return database;
};

const getDb = () => {
  if (!database) {
    throw new Error('Database not initialized. Call connectToDb first.');
  }
  return database;
};

const closeDb = async () => {
  if (client) {
    await client.close();
  }
  client = undefined;
  database = undefined;
};

export { connectToDb, getDb, closeDb };
