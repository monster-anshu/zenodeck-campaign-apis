import { InferSchemaType, Schema } from 'mongoose';

const CtrSchema = new Schema(
  {
    time: {
      required: true,
      type: Date,
    },
    url: {
      required: true,
      type: String,
    },
  },
  {
    _id: false,
  }
);

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
    ctr: [CtrSchema],
    from: {
      required: true,
      type: String,
    },
    html: {
      required: true,
      type: String,
    },
    lastSeenAt: Date,
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
