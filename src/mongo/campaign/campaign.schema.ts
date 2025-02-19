import { InferSchemaType, Schema } from 'mongoose';

export const CampaignSchema = new Schema(
  {
    appId: {
      required: true,
      type: Schema.ObjectId,
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

export type Campaign = InferSchemaType<typeof CampaignSchema>;
export const CampaignSchemaName = 'campaign';
