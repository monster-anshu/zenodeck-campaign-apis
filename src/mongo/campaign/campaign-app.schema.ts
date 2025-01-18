import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

const BOOKING_APP_STATUS = ['ACTIVE', 'DELETED'] as const;

const EncryptionSchema = new Schema(
  {
    algorithm: {
      type: String,
      required: true,
    },
    initVector: {
      type: String,
      required: true,
    },
    securitykey: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

export const BrandingSchema = new Schema({
  logo: { type: String },
  name: { type: String, required: true },
  url: { type: String },
});

// Company details
const CampaignAppSchema = new Schema(
  {
    branding: { type: BrandingSchema, required: true },
    companyId: { type: Schema.Types.ObjectId, required: true, index: true },
    companyProductId: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, enum: BOOKING_APP_STATUS, default: 'ACTIVE' },
    encryption: {
      type: EncryptionSchema,
      required: true,
    },
    storageUsed: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export type CampaignApp = InferSchemaType<typeof CampaignAppSchema>;

export const CampaignAppModel = MONGO_CONNECTION.DEFAULT.model<CampaignApp>(
  'campaignApp',
  CampaignAppSchema
);
