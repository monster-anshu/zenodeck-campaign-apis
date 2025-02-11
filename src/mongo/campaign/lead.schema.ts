import { InferSchemaType, Schema } from 'mongoose';

const LEAD_STATUS = ['ACTIVE', 'DELETED'] as const;

const LeadSchema = new Schema(
  {
    appId: {
      required: true,
      type: Schema.ObjectId,
    },
    email: {
      required: true,
      type: String,
    },
    firstName: String,
    lastName: String,
    leadListId: {
      required: true,
      type: Schema.ObjectId,
    },
    status: {
      enum: LEAD_STATUS,
      required: true,
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// LeadSchema.index({ leadListId: 1, email: 1 }, { unique: true });

const LeadSchemaName = 'lead';
type Lead = InferSchemaType<typeof LeadSchema>;

export { Lead, LeadSchema, LeadSchemaName };
