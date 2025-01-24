import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MongoIdZod } from '~/lib/zod';

const PopulateDefaultZod = z.object({
  userId: MongoIdZod,
  companyId: MongoIdZod,
  companyName: z.string().nonempty(),
});

export class PopulateDefaultDto extends createZodDto(PopulateDefaultZod) {}
