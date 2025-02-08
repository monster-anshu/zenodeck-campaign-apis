import { InferSchemaType, Schema } from 'mongoose';

export const CtrSchema = new Schema(
  {
    appId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    clicks: {
      default: 0,
      type: Number,
    },
    historyId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    url: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type Ctr = InferSchemaType<typeof CtrSchema>;
export const CtrSchemaName = 'ctr';
