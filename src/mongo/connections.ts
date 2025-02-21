import mongoose from 'mongoose';
import { MONGO_COMMON_URI, MONGO_DEFAULT_URI, NODE_ENV, STAGE } from '~/env';

const isProd = NODE_ENV === 'production';

if (!isProd) {
  mongoose.set('debug', true);
}

mongoose.set('runValidators', true);
mongoose.set('strict', true);
mongoose.set('autoIndex', !isProd);

export const MONGO_CONNECTION = {
  DEFAULT: mongoose.createConnection(MONGO_DEFAULT_URI),
  COMMON: mongoose.createConnection(MONGO_COMMON_URI),
};

MONGO_CONNECTION.DEFAULT.on('connected', function () {
  console.log('Mongoose: default connection opened');
});

MONGO_CONNECTION.COMMON.on('connected', function () {
  console.log('Mongoose: common connection opened');
});
