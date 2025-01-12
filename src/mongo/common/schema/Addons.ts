import { Schema } from 'mongoose';
import { MONGO_CONNECTION } from '~/mongo/connections';
import { Addons, Product } from '../types';

const AddonsSchema = new Schema<Addons>({
  key: { type: String, required: true },
  displayName: String,
  type: { type: String },
  status: { type: String, default: 'ACTIVE' },
  productId: { type: String, required: true, enum: Object.values(Product) },
  price: {
    annual: {
      inr: Number,
      usd: Number,
    },
    monthly: {
      inr: Number,
      usd: Number,
    },
  },
  configuration: {
    storageAmount: Number,
    agentCount: Number,
  },
  packageIds: [Schema.Types.ObjectId],
});

const AddonsModel = MONGO_CONNECTION.COMMON.model<Addons>(
  'Addons',
  AddonsSchema
);

export default AddonsModel;
