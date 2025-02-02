import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CREDENTIAL_TYPES } from '~/mongo/campaign';

export const PrivateKeysZod = z
  .object({
    type: z.enum(['RESEND_API']),
    privateKeys: z.object({
      apiKey: z.string().nonempty(),
    }),
  })
  .or(
    z.object({
      type: z.enum(['SMTP']),
      privateKeys: z.object({
        host: z.string().nonempty(),
        password: z.string().nonempty(),
        port: z.number(),
        username: z.string().nonempty(),
      }),
    })
  );

const AddCredentialZod = z
  .object({
    name: z.string().nonempty(),
  })
  .and(PrivateKeysZod);

export type AddCredential = z.infer<typeof AddCredentialZod>;
export class AddCredentialDto extends createZodDto(AddCredentialZod as never) {}
