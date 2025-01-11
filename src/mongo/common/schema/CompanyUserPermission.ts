import { Schema } from 'mongoose';
import { MONGO_CONNECTION } from '~/mongo/connections';
import { CompanyUserPermission } from '../types';
import CompanyModel from './Company';
import UserModel from './User';

const CompanyUserPermissionSchema = new Schema<CompanyUserPermission>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: CompanyModel,
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: UserModel, required: true },
    products: { type: [String] },
    role: { type: String },
    status: { type: String, default: 'ACTIVE' },
  },
  {
    timestamps: true,
  }
);

const CompanyUserPermissionModel =
  MONGO_CONNECTION.COMMON.model<CompanyUserPermission>(
    'CompanyUserPermission',
    CompanyUserPermissionSchema
  );

export default CompanyUserPermissionModel;
