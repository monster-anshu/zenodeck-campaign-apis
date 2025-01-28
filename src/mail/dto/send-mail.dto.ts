import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MongoIdZod } from '~/lib/zod';
import { template } from '../t';

const SendMailZod = z.object({
  credentialId: MongoIdZod,
  subject: z.string().nonempty(),
  projectData: z.string().catch(template),
  from: z.string().email(),
  to: z.string().email(),
});

export class SendMailDto extends createZodDto(SendMailZod) {}
