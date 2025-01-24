import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

const AGENT_STATUS = ['INVITED', 'ACTIVE', 'DELETED'] as const;

// data of agent
const AgentSchema = new Schema(
  {
    appId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    countryCode: {
      type: String,
    },

    firstName: {
      type: String,
    },

    invitedAt: {
      required: true,
      type: Date,
    },
    language: {
      default: 'en',
      type: String,
    },
    lastName: {
      type: String,
    },
    profilePic: String,
    roleId: {
      ref: 'role',
      required: true,
      type: Schema.Types.ObjectId,
    },
    status: {
      default: 'ACTIVE',
      enum: AGENT_STATUS,
      type: String,
    },

    userId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

AgentSchema.index({ appId: 1, userId: 1 }, { unique: true });

export type Agent = InferSchemaType<typeof AgentSchema>;

export const AgentModel = MONGO_CONNECTION.DEFAULT.model<Agent>(
  'agent',
  AgentSchema
);
