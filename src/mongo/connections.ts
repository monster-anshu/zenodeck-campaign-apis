import mongoose, { Connection } from 'mongoose';
import { MONGO_COMMON_URI, MONGO_DEFAULT_URI, NODE_ENV } from '~/env';

const isProd = NODE_ENV === 'production';

mongoose.set('debug', !isProd);
mongoose.set('runValidators', true);
mongoose.set('strict', true);
mongoose.set('autoIndex', !isProd);

const connectionsCache: Record<string, Connection> = {};

const createConnection = (url: string, name: string) => {
  if (connectionsCache[name]) return connectionsCache[name];

  const conn = mongoose.createConnection(url, {
    // Serverless-optimized settings
    // maxPoolSize: 5,
    // socketTimeoutMS: 30000,
    // connectTimeoutMS: 30000,
    // serverSelectionTimeoutMS: 5000,
  });

  conn.on('error', (err) => console.error(`Mongoose (${name}) error:`, err));
  conn.on('disconnected', () =>
    console.warn(`Mongoose (${name}) disconnected`)
  );
  conn.on('connected', () => console.log(`Mongoose (${name}) connected`));

  connectionsCache[name] = conn;
  return conn;
};

export const MONGO_CONNECTION = {
  DEFAULT: createConnection(MONGO_DEFAULT_URI, 'DEFAULT'),
  COMMON: createConnection(MONGO_COMMON_URI, 'COMMON'),
};

// Graceful shutdown
const shutdown = async () => {
  await MONGO_CONNECTION.DEFAULT.close();
  await MONGO_CONNECTION.COMMON.close();
  console.log('Mongoose connections closed');
};
process.on('SIGTERM', shutdown);
