import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CREDENTIAL_TYPES } from '~/mongo/campaign';

export const AddCredentialZod = z.object({
  name: z.string(),
  privateKeys: z.record(z.string()),
  type: z.enum(CREDENTIAL_TYPES),
});

export class AddCredentialDto extends createZodDto(AddCredentialZod) {}
