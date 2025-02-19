import { createZodDto } from 'nestjs-zod';
import { MongoIdZod } from '~/lib/zod';
import { CreateCampaignZod } from './create-campaign.dto';

const UpdateCampaignZod = CreateCampaignZod.partial().extend({
  id: MongoIdZod,
});

const RefinedSchema = UpdateCampaignZod.refine(
  (value) => (value.time ? value.time.valueOf() > Date.now() : true),
  {
    message: 'invalid time',
    path: ['time'],
  }
);

export class UpdateCampaignDto extends createZodDto(RefinedSchema) {}
