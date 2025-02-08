import { InferSchemaType, Schema } from 'mongoose';

export const EmailEvent = {
  OPEN: 'OPEN',
  CLICK: 'CLICK',
} as const;

export const EmailEventSchema = new Schema(
  {
    appId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    historyId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    type: {
      enum: Object.values(EmailEvent),
      required: true,
      type: String,
    },
  },
  {
    discriminatorKey: 'type',
    versionKey: false,
    timestamps: true,
  }
);

export const EmailOpenEventSchema = new Schema({
  count: {
    default: 0,
    type: Number,
  },
});

export const EmailLinkClickEventSchema = new Schema({
  count: {
    default: 0,
    type: Number,
  },
  url: {
    required: true,
    type: String,
  },
});

export const EmailEventSchemaName = 'emailevent';

export type EmailEvent = InferSchemaType<typeof EmailEventSchema>;
export type EmailOpenEvent = EmailEvent &
  InferSchemaType<typeof EmailOpenEventSchema>;
export type EmailLinkClick = EmailEvent &
  InferSchemaType<typeof EmailLinkClickEventSchema>;
