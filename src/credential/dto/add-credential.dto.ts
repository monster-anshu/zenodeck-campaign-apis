import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CREDENTIAL_TYPES } from '~/mongo/campaign';

const ResendKeyZod = z.object({
  type: z.enum(['RESEND_API']),
  privateKeys: z.object({
    apiKey: z.string().nonempty(),
  }),
});

const SmtpKeyZod = z.object({
  type: z.enum(['SMTP']),
  privateKeys: z.object({
    host: z.string().nonempty(),
    password: z.string().nonempty(),
    port: z.number(),
    username: z.string().nonempty(),
  }),
});

export const PrivateKeysZod = z.union([ResendKeyZod, SmtpKeyZod]);

const AddCredentialZod = z
  .object({
    name: z.string().nonempty(),
  })
  .and(PrivateKeysZod);

export type AddCredential = z.infer<typeof AddCredentialZod>;
export class AddCredentialDto extends createZodDto(AddCredentialZod as never) {}

export type ResendKey = z.infer<typeof ResendKeyZod>;
export type SmtpKey = z.infer<typeof SmtpKeyZod>;
