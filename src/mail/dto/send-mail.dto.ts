import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MongoIdZod } from '~/lib/zod';

const SendMailZod = z.object({
  credentialId: MongoIdZod,
  subject: z.string().nonempty(),
  projectData: z.string(),
  from: z.string().email(),
  to: z.array(z.string().email()).or(z.string().email()),
  name: z
    .string()
    .regex(/^(?!.*[<>]).*$/)
    .optional(),
});

export class SendMailDto extends createZodDto(SendMailZod) {}
