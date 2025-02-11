import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { MongoIdZod } from '~/lib/zod';

const UpdateLeadZod = z.object({
  id: MongoIdZod,
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export class UpdateLeadDto extends createZodDto(UpdateLeadZod) {}
