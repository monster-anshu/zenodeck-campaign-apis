import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { AddCredentialZod } from './add-credential.dto';

const EditCredentialZod = AddCredentialZod.partial().extend({
  id: z.string(),
});

export class EditCredentialDto extends createZodDto(EditCredentialZod) {}
