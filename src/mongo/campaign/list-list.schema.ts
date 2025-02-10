import { InferSchemaType, Schema } from 'mongoose';

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

const LeadListName = 'leadlist';
type LeadList = InferSchemaType<typeof LeadListSchema>;

export { LeadList, LeadListName, LeadListSchema };
