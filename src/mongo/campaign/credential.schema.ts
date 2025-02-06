import { InferSchemaType, Schema } from 'mongoose';

const CREDENTIAL_STATUS = ['ACTIVE', 'DELETED'] as const;
export const CREDENTIAL_TYPES = ['RESEND_API', 'SMTP'] as const;

export const PrivateKeysSchema = new Schema(
  {} as Record<string, string | number>,
  {
    _id: false,
    strict: false,
  }
);

export const CredentialSchema = new Schema(
  {
    appId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    createdBy: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    name: {
      type: String,
    },
    privateKeys: { type: PrivateKeysSchema, required: true },
    status: {
      default: 'ACTIVE',
      enum: CREDENTIAL_STATUS,
      type: String,
    },
    type: {
      enum: CREDENTIAL_TYPES,
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type Credential = InferSchemaType<typeof CredentialSchema>;
export type PrivateKeys = InferSchemaType<typeof PrivateKeysSchema>;
export type CredentialType = (typeof CREDENTIAL_TYPES)[number];

export const CredentialSchemaName = 'credential';

// export const CredentialModel = MONGO_CONNECTION.DEFAULT.model<Credential>(
//   'credential',
//   CredentialSchema
// );
