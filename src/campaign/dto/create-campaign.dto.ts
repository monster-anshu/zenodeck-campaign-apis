import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { validateFromString } from '~/grapejs/validate';
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
  projectData: z
    .string()
    .refine((value) => validateFromString(value), 'invalid_project_data'),
});

const RefinedSchema = CreateCampaignZod.refine(
  (value) => value.time.valueOf() > Date.now(),
  {
    message: 'invalid time',
    path: ['time'],
  }
);

export class CreateCampaignDto extends createZodDto(RefinedSchema) {}
