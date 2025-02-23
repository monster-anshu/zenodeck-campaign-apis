import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

const HISTORY_STATUS = ['SUCCESS', 'FAILED'] as const;

const HistorySchema = new Schema(
  {
    appId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    credentialId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    error: Schema.Types.Mixed,
    from: {
      required: true,
      type: String,
    },
    html: {
      required: true,
      type: String,
    },
    status: {
      enum: HISTORY_STATUS,
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

export const HistorySchemaName = 'history';
export const HistoryModel = MONGO_CONNECTION.DEFAULT.model(
  HistorySchemaName,
  HistorySchema
);

export type History = InferSchemaType<typeof HistorySchema>;
