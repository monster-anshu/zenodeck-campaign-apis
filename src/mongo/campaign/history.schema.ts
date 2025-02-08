import { InferSchemaType, Schema } from 'mongoose';

export const HistorySchema = new Schema(
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

export type History = InferSchemaType<typeof HistorySchema>;
export const HistorySchemaName = 'history';
