import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { MongoIdZod } from '~/lib/zod';

export const CampaignListZod = z.object({
  after: MongoIdZod.optional(),
  limit: z.coerce.number().max(100).min(1).default(10),
  q: z.string().optional(),
});

export class ListCampaignDto extends createZodDto(CampaignListZod) {}
