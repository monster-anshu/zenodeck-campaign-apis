import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AcceptInviteZod = z.object({
  userId: z.string(),
  companyId: z.string(),
});

export class AcceptInviteDto extends createZodDto(AcceptInviteZod) {}
