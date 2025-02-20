import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadListModule } from '~/lead-list/lead-list.module';
import { CampaignSchema, CampaignSchemaName } from '~/mongo/campaign';
import { ConnectionName } from '~/mongo/connections';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';

export const CampaignFeature = MongooseModule.forFeature(
  [{ name: CampaignSchemaName, schema: CampaignSchema }],
  ConnectionName.DEFAULT
);

@Module({
  imports: [CampaignFeature, LeadListModule],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
