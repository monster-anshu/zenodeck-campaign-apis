import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

export const EmailHistorySchema = new Schema(
  {
    agentId: {
      type: Schema.Types.ObjectId,
    },
    appId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    credentialId: {
      required: true,
      type: Schema.Types.ObjectId,
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
    isOpen: Boolean,
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
