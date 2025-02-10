import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { MongoIdZod } from '~/lib/zod';
import { LeadZod } from './create-lead-list.dto';

const ImportLeadZod = z.object({
  leadListId: MongoIdZod,
  leads: z.array(LeadZod),
});

export class ImportLeadDto extends createZodDto(ImportLeadZod) {}
