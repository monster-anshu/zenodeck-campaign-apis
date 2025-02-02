import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { MongoIdZod } from '~/lib/zod';
import { PrivateKeysZod } from './add-credential.dto';

const EditCredentialZod = z
  .object({
    id: MongoIdZod,
    name: z.string().nonempty().optional(),
  })
  .and(PrivateKeysZod);

export type EditCredential = z.infer<typeof EditCredentialZod>;
export class EditCredentialDto extends createZodDto(
  EditCredentialZod as never
) {}
