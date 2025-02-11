import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const LeadZod = z.object({
  email: z.string().email(),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
});

const CreateLeadListZod = z.object({
  name: z.string().trim().nonempty(),
  leads: z.array(LeadZod),
});

export class CreateLeadListDto extends createZodDto(CreateLeadListZod) {}
