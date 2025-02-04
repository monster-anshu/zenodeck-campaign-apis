import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

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

export const AddCredentialZod = z.object({
  name: z.string().nonempty(),
  payload: PrivateKeysZod,
});

export class AddCredentialDto extends createZodDto(AddCredentialZod) {}

export type ResendKey = z.infer<typeof ResendKeyZod>;
export type SmtpKey = z.infer<typeof SmtpKeyZod>;
