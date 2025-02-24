import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

const CAMPAIGN_STATUS = ['ACTIVE', 'DELETED'] as const;

const CampaignSchema = new Schema(
  {
    appId: {
      required: true,
      type: Schema.ObjectId,
    },
    credentialId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    description: String,
    leadListId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    name: {
      required: true,
      type: String,
    },
    queueId: String,
    status: {
      enum: CAMPAIGN_STATUS,
      required: true,
      type: String,
    },
    time: {
      required: true,
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CampaignSchemaName = 'campaign';
export const CampaignModel = MONGO_CONNECTION.DEFAULT.model(
  CampaignSchemaName,
  CampaignSchema
);

export type Campaign = InferSchemaType<typeof CampaignSchema>;
