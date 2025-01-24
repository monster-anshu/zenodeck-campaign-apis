import { createZodDto } from 'nestjs-zod';
import { MongoIdZod } from '~/lib/zod';
import { AddCredentialZod } from './add-credential.dto';

const EditCredentialZod = AddCredentialZod.partial().extend({
  id: MongoIdZod,
});

export class EditCredentialDto extends createZodDto(EditCredentialZod) {}
