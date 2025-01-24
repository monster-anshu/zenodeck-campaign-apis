import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MongoIdZod } from '~/lib/zod';

const AcceptInviteZod = z.object({
  userId: MongoIdZod,
  companyId: MongoIdZod,
});

export class AcceptInviteDto extends createZodDto(AcceptInviteZod) {}
