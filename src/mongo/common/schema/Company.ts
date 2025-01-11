import { Schema } from 'mongoose';
import { MONGO_CONNECTION } from '~/mongo/connections';
import { Company } from '../types';
import UserModel from './User';

const CompanySchema = new Schema<Company>(
  {
    companyName: { type: String, required: true },
    companyLogo: { type: String },
    primaryUserId: {
      type: Schema.Types.ObjectId,
      ref: UserModel,
      required: true,
    },
    status: { type: String, default: 'ACTIVE' },
  },
  {
    timestamps: true,
  }
);

const CompanyModel = MONGO_CONNECTION.COMMON.model<Company>(
  'Company',
  CompanySchema
);

export default CompanyModel;
