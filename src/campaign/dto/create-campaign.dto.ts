import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { MongoIdZod } from '~/lib/zod';

export const CreateCampaignZod = z.object({
  name: z.string().trim().nonempty(),
  credentialId: MongoIdZod,
  description: z.string().trim().optional(),
  leadListId: MongoIdZod,
  time: z.coerce.date(),
  from: z.string().email(),
  subject: z.string().trim().nonempty(),
  senderName: z.string().trim().nonempty().optional(),
  projectData: z.string(),
});

const RefinedSchema = CreateCampaignZod.refine(
  (value) => value.time.valueOf() > Date.now(),
  {
    message: 'invalid time',
    path: ['time'],
  }
);

export class CreateCampaignDto extends createZodDto(RefinedSchema) {}
