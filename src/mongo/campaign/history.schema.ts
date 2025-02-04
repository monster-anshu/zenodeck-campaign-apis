import { InferSchemaType, Schema, Types } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

export const EmailHistorySchema = new Schema(
  {
    agentId: {
      type: Types.ObjectId,
    },
    appId: {
      required: true,
      type: Types.ObjectId,
    },
    credentialId: {
      required: true,
      type: Types.ObjectId,
    },
    externalMessageId: String,
    from: {
      required: true,
      type: String,
    },
    html: {
      required: true,
      type: String,
    },
    subject: {
      required: true,
      type: String,
    },
    to: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type EmailHistory = InferSchemaType<typeof EmailHistorySchema>;

export const EmailHistoryModel = MONGO_CONNECTION.DEFAULT.model(
  'emailHistory',
  EmailHistorySchema
);
