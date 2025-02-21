import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

const LEAD_LIST_STATUS = ['ACTIVE', 'DELETED'] as const;

const LeadListSchema = new Schema(
  {
    appId: {
      required: true,
      type: Schema.ObjectId,
    },
    name: {
      required: true,
      type: String,
    },
    status: {
      enum: LEAD_LIST_STATUS,
      required: true,
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const LeadListSchemaName = 'leadlist';
export const LeadListModel = MONGO_CONNECTION.DEFAULT.model(
  LeadListSchemaName,
  LeadListSchema
);

export type LeadList = InferSchemaType<typeof LeadListSchema>;
