import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { MongoIdZod } from '~/lib/zod';

const UpdateLeadListZod = z.object({
  id: MongoIdZod,
  name: z.string(),
});

export class UpadteLeadListDto extends createZodDto(UpdateLeadListZod) {}
