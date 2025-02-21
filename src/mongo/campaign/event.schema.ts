import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

export const EmailEvent = {
  OPEN: 'OPEN',
  CLICK: 'CLICK',
} as const;

const EmailEventSchema = new Schema(
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

const EmailOpenEventSchema = new Schema({
  count: {
    default: 0,
    type: Number,
  },
});

const EmailLinkClickEventSchema = new Schema({
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

const EmailEventModel = MONGO_CONNECTION.DEFAULT.model(
  EmailEventSchemaName,
  EmailEventSchema
);
export const EmailOpenEventModel = EmailEventModel.discriminator(
  EmailEvent.OPEN,
  EmailOpenEventSchema
);
export const EmailLinkClickEventModel = EmailEventModel.discriminator(
  EmailEvent.CLICK,
  EmailLinkClickEventSchema
);

export type EmailEvent = InferSchemaType<typeof EmailEventSchema>;
export type EmailOpenEvent = EmailEvent &
  InferSchemaType<typeof EmailOpenEventSchema>;
export type EmailLinkClick = EmailEvent &
  InferSchemaType<typeof EmailLinkClickEventSchema>;
