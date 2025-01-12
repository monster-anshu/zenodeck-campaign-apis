import { Schema } from 'mongoose';
import { MONGO_CONNECTION } from '~/mongo/connections';
import { User } from '../types';

const UserSchema = new Schema<User>(
  {
    firstName: { type: String },
    lastName: { type: String },
    emailId: { type: String, required: true },
    emailVerified: { type: Boolean },
    emailVerifiedTstamp: { type: Date },
    countryCode: { type: String },
    mobileNo: { type: String },
    password: { type: String },
    status: { type: String, default: 'ACTIVE' },
    timezone: String,
  },
  {
    timestamps: true,
  }
);

const UserModel = MONGO_CONNECTION.COMMON.model<User>('User', UserSchema);

export default UserModel;
