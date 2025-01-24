import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const PopulateDefaultZod = z.object({
  userId: z.string(),
  companyId: z.string(),
  companyName: z.string().nonempty(),
});

export class PopulateDefaultDto extends createZodDto(PopulateDefaultZod) {}
