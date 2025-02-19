import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MongoIdZod } from '~/lib/zod';

const SendMailZod = z
  .object({
    credentialId: MongoIdZod,
    subject: z.string().nonempty(),
    projectData: z.string(),
    from: z.string().email(),
    leadListId: MongoIdZod.optional(),
    to: z
      .array(z.string().email())
      .nonempty()
      .or(z.string().email())
      .optional(),
    name: z
      .string()
      .regex(/^(?!.*[<>]).*$/)
      .optional(),
  })
  .refine((value) => value.leadListId || value.to, {
    message: 'target required',
    path: ['to'],
  });

export class SendMailDto extends createZodDto(SendMailZod) {}
