import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

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

export const HistorySchemaName = 'history';
export const HistoryModel = MONGO_CONNECTION.DEFAULT.model(
  HistorySchemaName,
  HistorySchema
);

export type History = InferSchemaType<typeof HistorySchema>;
