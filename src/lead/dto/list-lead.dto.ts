import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { MongoIdZod } from '~/lib/zod';

export const ListLeadZod = z.object({
  after: MongoIdZod.optional(),
  limit: z.coerce.number().max(100).min(1).default(10),
});

export class ListLeadDto extends createZodDto(ListLeadZod) {}
